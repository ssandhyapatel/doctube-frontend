import React, { useState, useEffect, useRef } from "react";
import { S } from "../styles/theme.jsx";

// DICOM ENGINE — a real, self-contained Part-10 DICOM parser and pixel


const DICOM_VR_WITH_4BYTE_LEN = new Set(["OB", "OW", "OF", "SQ", "UT", "UN"]); //[cite: 2]

function dicomReadTag(view, offset) {
  const group = view.getUint16(offset, true);
  const element = view.getUint16(offset + 2, true);
  return { group, element, tagStr: `x${group.toString(16).padStart(4, "0")}${element.toString(16).padStart(4, "0")}` }; //[cite: 2]
}

// Parses a DICOM Part-10 file (ArrayBuffer) into { tags: Map<tagStr, {vr, value, offset, length}>, pixelDataOffset, pixelDataLength, isExplicitVR }
export function parseDicomBuffer(buffer) {
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  let offset = 0;
  const hasPreamble =
    bytes.length > 132 &&
    bytes[128] === 0x44 && bytes[129] === 0x49 && bytes[130] === 0x43 && bytes[131] === 0x4d; //[cite: 2]
  if (hasPreamble) offset = 132;

  const tags = new Map();
  let transferSyntax = "1.2.840.10008.1.2.1"; //[cite: 2]
  let isExplicitVR = true; //[cite: 2]

  function readElement(forceExplicit) {
    if (offset + 8 > bytes.length) return null;
    const { group, element, tagStr } = dicomReadTag(view, offset);
    offset += 4;
    let vr = null;
    let length;
    const explicit = forceExplicit !== undefined ? forceExplicit : isExplicitVR;
    if (explicit) {
      vr = String.fromCharCode(bytes[offset], bytes[offset + 1]);
      offset += 2;
      if (DICOM_VR_WITH_4BYTE_LEN.has(vr)) {
        offset += 2; 
        length = view.getUint32(offset, true);
        offset += 4;
      } else {
        length = view.getUint16(offset, true);
        offset += 2;
      }
    } else {
      length = view.getUint32(offset, true);
      offset += 4;
    }
    if (length === 0xffffffff) return { group, element, tagStr, vr, length: 0, valueOffset: offset, skip: true }; //[cite: 2]
    const valueOffset = offset;
    offset += length;
    return { group, element, tagStr, vr, length, valueOffset }; //[cite: 2]
  }

  while (offset + 8 <= bytes.length) {
    const peek = dicomReadTag(view, offset);
    if (peek.group !== 0x0002) break;
    const el = readElement(true);
    if (!el || el.skip) break;
    if (el.group === 0x0002 && el.element === 0x0010) {
      let str = "";
      for (let i = 0; i < el.length; i++) {
        const c = bytes[el.valueOffset + i];
        if (c !== 0) str += String.fromCharCode(c);
      }
      transferSyntax = str.trim();
    }
    tags.set(el.tagStr, el); 
  }

  if (transferSyntax === "1.2.840.10008.1.2") {
    isExplicitVR = false; 
  } else if (transferSyntax.startsWith("1.2.840.10008.1.2.4") || transferSyntax.startsWith("1.2.840.10008.1.2.5")) {
    return { tags, transferSyntax, compressed: true, isExplicitVR }; //[cite: 2]
  } else {
    isExplicitVR = true; //[cite: 2]
  }

  let pixelDataOffset = null;
  let pixelDataLength = 0;

  while (offset + 8 <= bytes.length) {
    const el = readElement();
    if (!el) break;
    if (el.skip) { offset = bytes.length; break; } 
    tags.set(el.tagStr, el);
    if (el.group === 0x7fe0 && el.element === 0x0010) {
      pixelDataOffset = el.valueOffset;
      pixelDataLength = el.length;
      break; 
    }
  }

  function getStr(tagStr, fallback) {
    const el = tags.get(tagStr);
    if (!el) return fallback;
    let str = "";
    for (let i = 0; i < el.length; i++) {
      const c = bytes[el.valueOffset + i];
      if (c !== 0) str += String.fromCharCode(c);
    }
    return str.trim() || fallback; //[cite: 2]
  }
  function getNum(tagStr, fallback) {
    const s = getStr(tagStr, null);
    if (s === null) return fallback;
    const n = parseFloat(s.split("\\")[0]);
    return Number.isFinite(n) ? n : fallback; //[cite: 2]
  }
  function getUint16(tagStr, fallback) {
    const el = tags.get(tagStr);
    if (!el || el.length < 2) return fallback;
    return view.getUint16(el.valueOffset, true); //[cite: 2]
  }

  const rows = getUint16("x00280010", 0);
  const columns = getUint16("x00280011", 0);
  const bitsAllocated = getUint16("x00280100", 16);
  const pixelRepresentation = getUint16("x00280103", 0); 
  const samplesPerPixel = getUint16("x00280002", 1);
  const photometric = getStr("x00280004", "MONOCHROME2");
  const rescaleSlope = getNum("x00281053", 1);
  const rescaleIntercept = getNum("x00281052", 0);
  const windowCenter = getNum("x00281050", null);
  const windowWidth = getNum("x00281051", null);
  const instanceNumber = getNum("x00200013", 0);
  const seriesDescription = getStr("x0008103e", "");
  const modality = getStr("x00080060", "");
  const numberOfFrames = Math.max(1, getNum("x00280008", 1)); //[cite: 2]

  return {
    tags, transferSyntax, isExplicitVR, compressed: false,
    rows, columns, bitsAllocated, pixelRepresentation, samplesPerPixel, photometric,
    rescaleSlope, rescaleIntercept, windowCenter, windowWidth,
    instanceNumber, seriesDescription, modality, numberOfFrames,
    pixelDataOffset, pixelDataLength, buffer, //[cite: 2]
  };
}

export function decodeDicomPixels(parsed, frameIndex) {
  const { buffer, pixelDataOffset, rows, columns, bitsAllocated, pixelRepresentation, samplesPerPixel, rescaleSlope, rescaleIntercept } = parsed;
  if (pixelDataOffset === null || !rows || !columns) return null;
  const frame = frameIndex || 0;
  const pixelsPerFrame = rows * columns * samplesPerPixel;
  const bytesPerSample = bitsAllocated === 8 ? 1 : 2;
  const frameByteLength = pixelsPerFrame * bytesPerSample;
  const frameOffset = pixelDataOffset + frame * frameByteLength;
  const count = pixelsPerFrame;
  const out = new Float32Array(rows * columns); //[cite: 2]

  if (samplesPerPixel >= 3) {
    if (frameOffset + count > buffer.byteLength) return null;
    const src = new Uint8Array(buffer, frameOffset, count);
    for (let i = 0; i < rows * columns; i++) {
      const r = src[i * 3], g = src[i * 3 + 1], b = src[i * 3 + 2];
      out[i] = 0.299 * r + 0.587 * g + 0.114 * b; 
    }
    return { values: out, isRGB: true, rgbSource: src }; //[cite: 2]
  }

  if (bitsAllocated === 8) {
    if (frameOffset + count > buffer.byteLength) return null;
    const src = new Uint8Array(buffer, frameOffset, count);
    for (let i = 0; i < count; i++) out[i] = src[i] * rescaleSlope + rescaleIntercept;
  } else {
    const byteLen = count * 2;
    if (frameOffset + byteLen > buffer.byteLength) return null;
    if (pixelRepresentation === 1) {
      const src = new Int16Array(buffer.slice(frameOffset, frameOffset + byteLen));
      for (let i = 0; i < count; i++) out[i] = src[i] * rescaleSlope + rescaleIntercept;
    } else {
      const src = new Uint16Array(buffer.slice(frameOffset, frameOffset + byteLen));
      for (let i = 0; i < count; i++) out[i] = src[i] * rescaleSlope + rescaleIntercept;
    }
  }
  return { values: out, isRGB: false }; //[cite: 2]
}

export function renderDicomSlice(canvas, parsed, decoded, windowCenter, windowWidth) {
  const { rows, columns } = parsed;
  if (!rows || !columns || !decoded) return;
  canvas.width = columns;
  canvas.height = rows;
  const ctx = canvas.getContext("2d");
  const imgData = ctx.createImageData(columns, rows);
  const low = windowCenter - windowWidth / 2;
  const high = windowCenter + windowWidth / 2;
  const range = Math.max(1, high - low); //[cite: 2]

  if (decoded.isRGB) {
    const src = decoded.rgbSource;
    for (let i = 0; i < rows * columns; i++) {
      imgData.data[i * 4] = src[i * 3];
      imgData.data[i * 4 + 1] = src[i * 3 + 1];
      imgData.data[i * 4 + 2] = src[i * 3 + 2];
      imgData.data[i * 4 + 3] = 255;
    }
  } else {
    const v = decoded.values;
    for (let i = 0; i < rows * columns; i++) {
      let norm = (v[i] - low) / range;
      norm = norm < 0 ? 0 : norm > 1 ? 1 : norm;
      const g = (norm * 255) | 0;
      imgData.data[i * 4] = g;
      imgData.data[i * 4 + 1] = g;
      imgData.data[i * 4 + 2] = g;
      imgData.data[i * 4 + 3] = 255; //[cite: 2]
    }
  }
  ctx.putImageData(imgData, 0, 0); //[cite: 2]
}

export function DicomViewer({ series }) {
  const canvasRef = useRef(null);
  const [parsedStack, setParsedStack] = useState(null); 
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);
  const [wc, setWc] = useState(40);
  const [ww, setWw] = useState(400);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null); //[cite: 2]

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setParsedStack(null);
    (async () => {
      try {
        const loaded = [];
        const skipped = [];
        for (const item of series) {
          const buf = await item.blob.arrayBuffer();
          const parsed = parseDicomBuffer(buf);
          if (parsed.compressed) {
            throw new Error(
              `"${item.name}" uses a compressed DICOM transfer syntax (${parsed.transferSyntax}). This viewer renders uncompressed Explicit/Implicit VR Little Endian studies.`
            ); //[cite: 2]
          }
          if (!parsed.rows || !parsed.columns || parsed.pixelDataOffset === null) {
            skipped.push(item.name);
            continue;
          }
          for (let f = 0; f < parsed.numberOfFrames; f++) {
            loaded.push({
              name: parsed.numberOfFrames > 1 ? `${item.name} (frame ${f + 1}/${parsed.numberOfFrames})` : item.name,
              parsed, frameIndex: f,
              sortKey: (parsed.instanceNumber || 0) * 100000 + f, //[cite: 2]
            });
          }
        }
        if (loaded.length === 0) {
          throw new Error(
            skipped.length > 0
              ? `No renderable image frames found.`
              : "No renderable image frames found in this series."
          ); //[cite: 2]
        }
        loaded.sort((a, b) => a.sortKey - b.sortKey);
        if (!cancelled) {
          setParsedStack(loaded);
          const first = loaded[0].parsed;
          setWc(first.windowCenter !== null ? first.windowCenter : 40);
          setWw(first.windowWidth !== null ? first.windowWidth : 400);
          setIndex(0); //[cite: 2]
        }
      } catch (e) {
        if (!cancelled) setError(e.message || String(e));
      }
    })();
    return () => { cancelled = true; };
  }, [series]); //[cite: 2]

  const decodeCacheRef = useRef(new Map());
  const [decodedSlice, setDecodedSlice] = useState(null); //[cite: 2]

  useEffect(() => {
    if (!parsedStack) return;
    const entry = parsedStack[index];
    if (!entry) return;
    const cacheKey = `${index}`;
    const cache = decodeCacheRef.current;
    if (cache.has(cacheKey)) {
      setDecodedSlice(cache.get(cacheKey));
      return;
    }
    const decoded = decodeDicomPixels(entry.parsed, entry.frameIndex);
    if (decoded) {
      if (cache.size > 12) cache.delete(cache.keys().next().value);
      cache.set(cacheKey, decoded); //[cite: 2]
    }
    setDecodedSlice(decoded);
  }, [parsedStack, index]); //[cite: 2]

  useEffect(() => {
    if (!parsedStack || !canvasRef.current || !decodedSlice) return;
    const slice = parsedStack[index];
    if (!slice) return;
    renderDicomSlice(canvasRef.current, slice.parsed, decodedSlice, wc, ww); //[cite: 2]
  }, [parsedStack, index, wc, ww, decodedSlice]); //[cite: 2]

  function onWheel(e) {
    if (!parsedStack || parsedStack.length < 2) return;
    e.preventDefault();
    setIndex(i => {
      const next = i + (e.deltaY > 0 ? 1 : -1);
      return Math.max(0, Math.min(parsedStack.length - 1, next)); //[cite: 2]
    });
  }

  function onMouseDown(e) {
    dragRef.current = { x: e.clientX, y: e.clientY, button: e.button, startWc: wc, startWw: ww, startPan: pan };
    e.preventDefault(); //[cite: 2]
  }
  function onMouseMove(e) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    if (dragRef.current.button === 2) {
      setPan({ x: dragRef.current.startPan.x + dx, y: dragRef.current.startPan.y + dy });
    } else if (e.shiftKey) {
      setZoom(z => Math.max(0.2, Math.min(6, z + dy * -0.01)));
    } else {
      setWw(Math.max(1, dragRef.current.startWw + dx * 3));
      setWc(dragRef.current.startWc - dy * 2); //[cite: 2]
    }
  }
  function onMouseUp() { dragRef.current = null; }
  function onKeyDown(e) {
    if (!parsedStack) return;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") setIndex(i => Math.max(0, i - 1));
    if (e.key === "ArrowDown" || e.key === "ArrowRight") setIndex(i => Math.min(parsedStack.length - 1, i + 1)); //[cite: 2]
  }

  if (error) {
    return (
      <div style={S.dicomError}>
        <div style={S.dicomErrorTitle}>Could not render this DICOM series</div>
        <div style={S.dicomErrorBody}>{error}</div>
      </div>
    ); //[cite: 2]
  }
  if (!parsedStack) {
    return <div style={S.dicomLoading}>Decoding DICOM pixel data…</div>; //[cite: 2]
  }

  const slice = parsedStack[index];

  return (
    <div style={S.dicomViewer}>
      <div
        style={S.dicomCanvasWrap}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onContextMenu={e => e.preventDefault()}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <canvas
          ref={canvasRef}
          style={{
            ...S.dicomCanvas,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        />
        <div style={S.dicomOverlayTopLeft}>
          <div>{slice.parsed.modality || "—"} {slice.parsed.seriesDescription ? `· ${slice.parsed.seriesDescription}` : ""}</div>
          <div>{slice.parsed.columns}×{slice.parsed.rows}</div>
        </div>
        <div style={S.dicomOverlayTopRight}>
          <div>WL: {Math.round(wc)} / {Math.round(ww)}</div>
        </div>
        <div style={S.dicomOverlayBottomLeft}>
          <div>Img {index + 1} / {parsedStack.length}</div>
        </div>
        <div style={S.dicomOverlayBottomRight}>
          <div>Zoom {zoom.toFixed(2)}x</div>
        </div>
      </div>

      <div style={S.dicomControls}>
        <input
          type="range" min={0} max={parsedStack.length - 1} value={index}
          onChange={e => setIndex(Number(e.target.value))}
          style={S.dicomSlider}
        />
        <div style={S.dicomControlsRow}>
          <button style={S.dicomBtn} onClick={() => { setWc(40); setWw(400); setZoom(1); setPan({ x: 0, y: 0 }); }}>Reset</button>
          <span style={S.dicomHint}>Scroll: slices · Drag: window/level · Shift+drag: zoom · Right-drag: pan</span>
        </div>
      </div>
    </div>
  );
} 
import React, { useState, useEffect, useMemo } from "react";
import { caseStore } from "../services/store.js";
import { DicomViewer } from "./DicomViewer.jsx";
import { S } from "../styles/theme.jsx";

// ---------------------------------------------------------------------------
// MEDIA GALLERY — renders a disease's attached imaging. Media items can come
// from two places with one shared shape downstream:
//   - statically authored: { kind, name, url, studyLabel }
//   - admin-uploaded: { kind, name, mediaId, studyLabel } — mediaId resolves
//     through caseStore.getMediaBlob(id) to an actual Blob at render time.
// DICOM items sharing the same studyLabel are grouped into one stack and
// handed to DicomViewer together.
// ---------------------------------------------------------------------------

export function useResolvedMediaBlob(item) {
  const [blob, setBlob] = useState(item.url ? null : undefined); 
  useEffect(() => {
    let cancelled = false;
    if (item.url) { setBlob(null); return; }
    if (item.mediaId) {
      caseStore.getMediaBlob(item.mediaId).then(b => { if (!cancelled) setBlob(b); });
    }
    return () => { cancelled = true; };
  }, [item.mediaId, item.url]);
  return blob;
}

export function MediaImage({ item }) {
  const blob = useResolvedMediaBlob(item);
  const [src, setSrc] = useState(item.url || null);
  useEffect(() => {
    if (item.url) return;
    if (blob) {
      const u = URL.createObjectURL(blob);
      setSrc(u);
      return () => URL.revokeObjectURL(u);
    }
  }, [blob, item.url]);
  if (!src) return <div style={S.mediaThumbLoading}>Loading…</div>;
  return <img src={src} alt={item.name} style={S.mediaImage} />;
}

export function MediaVideo({ item }) {
  const blob = useResolvedMediaBlob(item);
  const [src, setSrc] = useState(item.url || null);
  useEffect(() => {
    if (item.url) return;
    if (blob) {
      const u = URL.createObjectURL(blob);
      setSrc(u);
      return () => URL.revokeObjectURL(u);
    }
  }, [blob, item.url]);
  if (!src) return <div style={S.mediaThumbLoading}>Loading…</div>;
  return <video src={src} controls style={S.mediaVideo} />;
}

// For a DICOM group, resolves every item's blob and hands the whole stack
// to DicomViewer in one go.
export function DicomSeriesGroup({ items }) {
  const [resolved, setResolved] = useState(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const out = [];
      for (const item of items) {
        let blob = null;
        if (item.url) {
          const res = await fetch(item.url);
          blob = await res.blob();
        } else if (item.mediaId) {
          blob = await caseStore.getMediaBlob(item.mediaId);
        }
        if (blob) out.push({ id: item.id || item.name, name: item.name, blob });
      }
      if (!cancelled) setResolved(out);
    })();
    return () => { cancelled = true; };
  }, [items]);

  if (!resolved) return <div style={S.dicomLoading}>Loading DICOM series…</div>;
  if (resolved.length === 0) return <div style={S.muted}>No readable DICOM files in this series.</div>;
  return <DicomViewer series={resolved} />;
}

export function MediaGallery({ media }) {
  const studies = useMemo(() => {
    const groups = new Map();
    media.forEach(item => {
      const key = item.studyLabel || "Imaging";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });
    return Array.from(groups.entries());
  }, [media]);

  return (
    <div style={S.mediaGallery}>
      {studies.map(([label, items]) => {
        const dicomItems = items.filter(i => i.kind === "dicom");
        const imageItems = items.filter(i => i.kind === "image");
        const videoItems = items.filter(i => i.kind === "video");
        return (
          <div key={label} style={S.mediaStudyBlock}>
            <div style={S.mediaStudyLabel}>{label}</div>
            {dicomItems.length > 0 && (
              <div style={S.mediaDicomSlot}>
                <DicomSeriesGroup items={dicomItems} />
              </div>
            )}
            {(imageItems.length > 0 || videoItems.length > 0) && (
              <div style={S.mediaThumbGrid}>
                {imageItems.map((item, i) => <MediaImage key={item.id || i} item={item} />)}
                {videoItems.map((item, i) => <MediaVideo key={item.id || i} item={item} />)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
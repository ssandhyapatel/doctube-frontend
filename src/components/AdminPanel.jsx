import React, { useState, useEffect, useMemo } from "react";
import { S } from "../styles/theme.jsx";
import { caseStore, adminStore, ACTIVE_BACKEND, API_BASE_URL, ADMIN_LOCAL_PASSWORD } from "../services/store.js";
import { TAXONOMY, getTaxonomyOptions } from "../data/taxonomy.js";
import { uid, slugify } from "../utils/common.js";
import { Breadcrumb } from "./ui.jsx";

const EMPTY_CASE_FORM = {
  systemSlug: "", categorySlug: "", subcategorySlug: "", customSubcategoryName: "",
  name: "", slug: "",
  overview: "", epidemiology: "", features: "", pathology: "", genetics: "", pearls: "",
  keySigns: "", 
  imagingRows: [{ seq: "", val: "" }],
}; //[cite: 2]

export function AdminPanel({ nav }) {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [checking, setChecking] = useState(false);

  async function trySubmit() {
    setPwError(false);
    if (ACTIVE_BACKEND === "api") {
      setChecking(true);
      try {
        const res = await fetch(`${API_BASE_URL}/admin/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: pwInput }),
        });
        if (!res.ok) { setPwError(true); return; }
        const { token } = await res.json();
        try { localStorage.setItem("doctube_admin_token", token); } catch { /* ignore */ }
        setAuthed(true);
      } catch {
        setPwError(true);
      } finally {
        setChecking(false);
      }
      return;
    }
    if (pwInput === ADMIN_LOCAL_PASSWORD) { setAuthed(true); setPwError(false); }
    else setPwError(true);
  }

  if (!authed) {
    return (
      <div style={S.pageWrap}>
        <div style={S.adminGate}>
          <div style={S.adminGateTitle}>Doctor Admin Access</div>
          <div style={S.adminGateSub}>Enter the shared admin password to add or edit cases.</div>
          <input
            type="password" autoFocus value={pwInput}
            onChange={e => { setPwInput(e.target.value); setPwError(false); }}
            onKeyDown={e => { if (e.key === "Enter") trySubmit(); }}
            placeholder="Admin password"
            style={S.adminGateInput}
          />
          {pwError && <div style={S.adminGateError}>Incorrect password.</div>}
          <button onClick={trySubmit} style={S.adminGateBtn} disabled={checking}>{checking ? "Checking…" : "Enter"}</button>
          <div style={S.adminGateNote}>
            Note: this is a simple shared-password gate, suitable for a small trusted team. It is not
            per-user authentication — anyone with this password can add or remove cases.
          </div>
        </div>
      </div>
    );
  }

  return <AdminWorkspace nav={nav} />;
} //[cite: 2]

function AdminWorkspace({ nav }) {
  const [view, setView] = useState("list"); 
  const [cases, setCases] = useState(adminStore.getCases());

  useEffect(() => adminStore.subscribe(() => setCases(adminStore.getCases())), []);

  return (
    <div style={S.pageWrap}>
      <Breadcrumb
        crumbs={view === "new" ? ["Home", "Admin", "New Case"] : ["Home", "Admin"]}
        onClick={(i) => {
          if (i === 0) nav("home");
          else if (i === 1 && view === "new") setView("list");
        }}
      />
      <div style={S.diseaseHeader}>
        <div>
          {view === "new" && (
            <button style={S.adminBackBtn} onClick={() => setView("list")}>← Back to case list</button>
          )}
          <h1 style={S.pageTitle}>{view === "new" ? "Add New Case" : "Doctor Admin Panel"}</h1>
          <p style={S.pageLead}>
            {view === "new"
              ? "Fill in the case details below. Saving pushes it straight into the live taxonomy."
              : "Add a case to the live taxonomy — it appears in the sidebar tree, the header Browse menu, search, and the Case Library immediately, exactly like a hand-authored entry."}
          </p>
        </div>
        <div style={S.adminHeaderActions}>
          {view === "list" && (
            <button style={S.adminPrimaryBtn} onClick={() => setView("new")}>+ Add New Case</button>
          )}
          <button style={S.adminSecondaryBtn} onClick={() => nav("home")}>Exit to main site</button>
        </div>
      </div>

      {view === "list" && <AdminCaseList cases={cases} nav={nav} />}
      {view === "new" && <AdminCaseForm onDone={() => setView("list")} onCancel={() => setView("list")} />}
    </div>
  );
} //[cite: 2]

function AdminCaseList({ cases, nav }) {
  if (cases.length === 0) {
    return (
      <div style={S.adminEmptyState}>
        No admin-added cases yet. Click "Add New Case" to add the first one — it'll show up across the whole
        site immediately.
      </div>
    );
  }
  return (
    <div style={S.adminCaseList}>
      {cases.map(c => {
        const sys = TAXONOMY.find(s => s.slug === c.systemSlug);
        const cat = sys && sys.categories.find(x => x.slug === c.categorySlug);
        const sub = cat && cat.subcategories.find(x => x.slug === c.subcategorySlug);
        const path = sys && cat && sub ? `${sys.slug}/${cat.slug}/${sub.slug}/${c.slug}` : null;
        return (
          <div key={c.id} style={S.adminCaseRow}>
            <div>
              <div style={S.adminCaseName}>{c.name}</div>
              <div style={S.adminCaseMeta}>
                {sys ? sys.name : c.systemSlug} → {cat ? cat.name : c.categorySlug} → {sub ? sub.name : c.subcategorySlug}
                {c.detail.media && c.detail.media.length > 0 && ` · ${c.detail.media.length} media file${c.detail.media.length === 1 ? "" : "s"}`}
              </div>
            </div>
            <div style={S.adminCaseActions}>
              {path && <button style={S.adminCaseViewBtn} onClick={() => nav("disease", { path })}>View on site</button>}
              <button
                style={S.adminCaseDeleteBtn}
                onClick={() => { if (window.confirm(`Delete "${c.name}"? This cannot be undone.`)) adminStore.deleteCase(c.id); }}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
} //[cite: 2]

function AdminCaseForm({ onDone, onCancel }) {
  const taxonomy = useMemo(getTaxonomyOptions, []);
  const [form, setForm] = useState(EMPTY_CASE_FORM);
  const [files, setFiles] = useState([]); 
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const sys = taxonomy.find(s => s.slug === form.systemSlug);
  const cat = sys && sys.categories.find(c => c.slug === form.categorySlug);

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function detectKind(file) {
    const ext = file.name.toLowerCase().split(".").pop();
    if (["dcm", "dicom", "ima"].includes(ext) || file.type === "application/dicom") return "dicom";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("image/")) return "image";
    return "unknown";
  }

  async function sniffUnknownFiles(fileList) {
    const out = [];
    for (const file of fileList) {
      let kind = detectKind(file);
      if (kind === "unknown") {
        const head = new Uint8Array(await file.slice(128, 132).arrayBuffer());
        const isDicomMagic = head[0] === 0x44 && head[1] === 0x49 && head[2] === 0x43 && head[3] === 0x4d;
        kind = isDicomMagic ? "dicom" : "image";
      }
      out.push({ id: uid(), file, kind, studyLabel: "Imaging" });
    }
    return out;
  }

  async function onFilesSelected(e) {
    const list = Array.from(e.target.files || []);
    const detected = await sniffUnknownFiles(list);
    setFiles(f => [...f, ...detected]);
    e.target.value = "";
  }

  function removeFile(id) {
    setFiles(f => f.filter(x => x.id !== id));
  }
  function setFileStudyLabel(id, label) {
    setFiles(f => f.map(x => x.id === id ? { ...x, studyLabel: label } : x));
  }

  function addImagingRow() {
    setForm(f => ({ ...f, imagingRows: [...f.imagingRows, { seq: "", val: "" }] }));
  }
  function setImagingRow(i, field, value) {
    setForm(f => {
      const rows = f.imagingRows.slice();
      rows[i] = { ...rows[i], [field]: value };
      return { ...f, imagingRows: rows };
    });
  }
  function removeImagingRow(i) {
    setForm(f => ({ ...f, imagingRows: f.imagingRows.filter((_, idx) => idx !== i) }));
  }

  async function handleSave() {
    setErr(null);
    if (!form.systemSlug || !form.categorySlug || !form.subcategorySlug) {
      setErr("Choose a System, Category, and Subcategory — every case must map to one exact taxonomy node.");
      return;
    }
    if (form.subcategorySlug === "__other__" && !(form.customSubcategoryName || "").trim()) {
      setErr("Enter a name for the custom subcategory, or pick one from the list.");
      return;
    }
    if (!form.name.trim()) {
      setErr("Give the case a name.");
      return;
    }
    setSaving(true);
    try {
      let subcategorySlug = form.subcategorySlug;
      if (subcategorySlug === "__other__") {
        const customName = form.customSubcategoryName.trim();
        const customSlug = slugify(customName);
        const liveSys = TAXONOMY.find(s => s.slug === form.systemSlug);
        const liveCat = liveSys && liveSys.categories.find(c => c.slug === form.categorySlug);
        if (!liveCat) { setErr("Selected system/category no longer exists."); setSaving(false); return; }
        let liveSub = liveCat.subcategories.find(s => s.slug === customSlug);
        if (!liveSub) {
          liveSub = { name: customName, slug: customSlug, diseases: [] };
          liveCat.subcategories.push(liveSub);
        }
        subcategorySlug = customSlug;
      }

      const media = [];
      for (const f of files) {
        const saved = await caseStore.saveMedia({ name: f.file.name, type: f.kind, mime: f.file.type, blob: f.file });
        media.push({ id: saved.id, mediaId: saved.id, name: f.file.name, kind: f.kind, studyLabel: f.studyLabel });
      }

      const imaging = {};
      form.imagingRows.forEach(row => {
        if (row.seq.trim()) imaging[row.seq.trim().replace(/[^A-Za-z0-9]+/g, "_")] = row.val;
      });

      const slug = form.slug.trim() ? slugify(form.slug) : slugify(form.name);

      await adminStore.addCase({
        systemSlug: form.systemSlug, categorySlug: form.categorySlug, subcategorySlug,
        name: form.name.trim(), slug,
        detail: {
          overview: form.overview.trim() || "Detailed clinical profile for this entity is being authored. This entry exists in the taxonomy and is ready to receive structured content.",
          epidemiology: form.epidemiology.trim() || "—",
          features: form.features.trim() || "—",
          pathology: form.pathology.trim() || "—",
          genetics: form.genetics.trim() || "—",
          pearls: form.pearls.trim() || "Content pending.",
          keySigns: form.keySigns.split(",").map(s => s.trim()).filter(Boolean),
          imaging,
          differentials: [],
          media,
        },
      });
      onDone();
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={S.adminForm}>
      {err && <div style={S.adminFormError}>{err}</div>}

      <div style={S.adminFormSection}>
        <div style={S.adminFormSectionTitle}>1. Taxonomy Placement</div>
        <div style={S.adminFormSectionSub}>Every case must belong to one exact location in the tree — no duplicates, no confusion.</div>
        <div style={S.adminFormRow3}>
          <AdminSelect
            label="System" value={form.systemSlug}
            onChange={v => setForm(f => ({ ...f, systemSlug: v, categorySlug: "", subcategorySlug: "" }))}
            options={taxonomy.map(s => ({ value: s.slug, label: `${s.icon} ${s.name}` }))}
          />
          <AdminSelect
            label="Category" value={form.categorySlug} disabled={!sys}
            onChange={v => setForm(f => ({ ...f, categorySlug: v, subcategorySlug: "" }))}
            options={sys ? sys.categories.map(c => ({ value: c.slug, label: c.name })) : []}
          />
          <AdminSelect
            label="Subcategory" value={form.subcategorySlug} disabled={!cat}
            onChange={v => set("subcategorySlug", v)}
            options={[
              ...(cat ? cat.subcategories.map(s => ({ value: s.slug, label: s.name })) : []),
              { value: "__other__", label: "Other (custom)" },
            ]}
          />
        </div>
        {form.subcategorySlug === "__other__" && (
          <div style={S.adminFormRow2}>
            <AdminField
              label="Custom Subcategory Name"
              value={form.customSubcategoryName || ""}
              onChange={v => set("customSubcategoryName", v)}
              placeholder="e.g. Postoperative Findings"
            />
          </div>
        )}
      </div>

      <div style={S.adminFormSection}>
        <div style={S.adminFormSectionTitle}>2. Case Identity</div>
        <div style={S.adminFormRow2}>
          <AdminField label="Disease / Case Name" value={form.name} onChange={v => set("name", v)} placeholder="e.g. Rasmussen Encephalitis" />
          <AdminField label="URL Slug (optional — auto-generated from name)" value={form.slug} onChange={v => set("slug", v)} placeholder="e.g. rasmussen-encephalitis" />
        </div>
      </div>

      <div style={S.adminFormSection}>
        <div style={S.adminFormSectionTitle}>3. Clinical Profile</div>
        <AdminTextarea label="Overview" value={form.overview} onChange={v => set("overview", v)} rows={3} />
        <div style={S.adminFormRow2}>
          <AdminTextarea label="Epidemiology" value={form.epidemiology} onChange={v => set("epidemiology", v)} rows={3} />
          <AdminTextarea label="Clinical Features" value={form.features} onChange={v => set("features", v)} rows={3} />
        </div>
        <div style={S.adminFormRow2}>
          <AdminTextarea label="Gross & Microscopic Pathology" value={form.pathology} onChange={v => set("pathology", v)} rows={3} />
          <AdminTextarea label="Genetics & Molecular Markers" value={form.genetics} onChange={v => set("genetics", v)} rows={3} />
        </div>
        <AdminTextarea label="Teaching Pearls" value={form.pearls} onChange={v => set("pearls", v)} rows={2} />
        <AdminField label="Key Signs (comma-separated)" value={form.keySigns} onChange={v => set("keySigns", v)} placeholder="e.g. Butterfly lesion, Dural tail sign" />
      </div>

      <div style={S.adminFormSection}>
        <div style={S.adminFormSectionTitle}>4. Imaging Findings (by sequence)</div>
        {form.imagingRows.map((row, i) => (
          <div key={i} style={S.adminImagingRow}>
            <input
              style={S.adminImagingSeqInput} placeholder="Sequence (e.g. T1, T2_FLAIR, DWI_ADC)"
              value={row.seq} onChange={e => setImagingRow(i, "seq", e.target.value)}
            />
            <input
              style={S.adminImagingValInput} placeholder="Finding"
              value={row.val} onChange={e => setImagingRow(i, "val", e.target.value)}
            />
            <button style={S.adminRemoveRowBtn} onClick={() => removeImagingRow(i)} title="Remove row">×</button>
          </div>
        ))}
        <button style={S.adminAddRowBtn} onClick={addImagingRow}>+ Add imaging finding</button>
      </div>

      <div style={S.adminFormSection}>
        <div style={S.adminFormSectionTitle}>5. Media — Images, DICOM, or Video</div>
        <div style={S.adminFormSectionSub}>
          CT/MRI/USG DICOM files, photos, or short clips. DICOM files sharing the same study label scroll
          together as one series in the viewer. A real PACS/DICOM export is usually a <em>folder</em> of
          individual files (not one file) — use "Choose DICOM folder" to select the whole folder at once
          instead of picking files one by one.
        </div>
        <div style={S.adminDropzoneRow}>
          <label style={S.adminDropzone}>
            <input type="file" multiple onChange={onFilesSelected} style={{ display: "none" }} />
            <div style={S.adminDropzoneText}>Click to choose files</div>
            <div style={S.adminDropzoneHint}>Pick individual images, videos, or DICOM files</div>
          </label>
          <label style={S.adminDropzone}>
            <input type="file" multiple webkitdirectory="" directory="" onChange={onFilesSelected} style={{ display: "none" }} />
            <div style={S.adminDropzoneText}>Choose DICOM folder</div>
            <div style={S.adminDropzoneHint}>Select an entire PACS export folder — every file inside is added and sniffed automatically</div>
          </label>
        </div>
        {files.length > 0 && (
          <div style={S.adminFileList}>
            {files.map(f => (
              <div key={f.id} style={S.adminFileRow}>
                <span style={S.adminFileKindBadge(f.kind)}>{f.kind.toUpperCase()}</span>
                <span style={S.adminFileName}>{f.file.name}</span>
                <input
                  style={S.adminFileStudyInput} placeholder="Study label (e.g. MRI Brain Axial T2)"
                  value={f.studyLabel} onChange={e => setFileStudyLabel(f.id, e.target.value)}
                />
                <button style={S.adminRemoveRowBtn} onClick={() => removeFile(f.id)} title="Remove file">×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={S.adminFormActions}>
        <button style={S.adminCancelBtn} onClick={onCancel} disabled={saving}>Cancel</button>
        <button style={S.adminSaveBtn} onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save Case to Live Site"}
        </button>
      </div>
    </div>
  );
} //[cite: 2]

function AdminSelect({ label, value, onChange, options, disabled }) {
  return (
    <label style={S.adminFieldWrap}>
      <span style={S.adminFieldLabel}>{label}</span>
      <select style={S.adminSelect} value={value} disabled={disabled} onChange={e => onChange(e.target.value)}>
        <option value="">{disabled ? "—" : "Select…"}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function AdminField({ label, value, onChange, placeholder }) {
  return (
    <label style={S.adminFieldWrap}>
      <span style={S.adminFieldLabel}>{label}</span>
      <input style={S.adminInput} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
    </label>
  );
}

function AdminTextarea({ label, value, onChange, rows }) {
  return (
    <label style={S.adminFieldWrap}>
      <span style={S.adminFieldLabel}>{label}</span>
      <textarea style={S.adminTextarea} value={value} rows={rows} onChange={e => onChange(e.target.value)} />
    </label>
  );
} //[cite: 2]
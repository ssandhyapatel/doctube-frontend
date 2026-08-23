import { TAXONOMY } from "../data/taxonomy.js";
import { uid, slugify } from "../utils/common.js";

// ---------------------------------------------------------------------------
// RUNTIME TAXONOMY — admin-added cases merge into the SAME tree
// ---------------------------------------------------------------------------

let adminCases = [];
let FLAT_DISEASES = [];
const adminListeners = new Set();

export function rebuildFlatDiseases() {
  TAXONOMY.forEach((sys) =>
    sys.categories.forEach((cat) =>
      cat.subcategories.forEach((sub) => {
        sub.diseases = sub.diseases.filter((d) => !d._admin);
      })
    )
  );

  adminCases.forEach((rec) => {
    const sys = TAXONOMY.find((s) => s.slug === rec.systemSlug);
    if (!sys) return;
    const cat = sys.categories.find((c) => c.slug === rec.categorySlug);
    if (!cat) return;
    const sub = cat.subcategories.find((s) => s.slug === rec.subcategorySlug);
    if (!sub) return;
    sub.diseases.push({
      name: rec.name,
      slug: rec.slug,
      detail: rec.detail,
      _admin: true,
      _adminId: rec.id,
    });
  });

  const flat = [];
  TAXONOMY.forEach((sys) =>
    sys.categories.forEach((cat) =>
      cat.subcategories.forEach((sub) =>
        sub.diseases.forEach((dis) => {
          flat.push({ sys, cat, sub, dis });
        })
      )
    )
  );
  FLAT_DISEASES = flat;
}
rebuildFlatDiseases();

export const adminStore = {
  subscribe(fn) {
    adminListeners.add(fn);
    return () => adminListeners.delete(fn);
  },
  notify() {
    adminListeners.forEach((fn) => fn());
  },
  getCases() {
    return adminCases;
  },
  async refresh() {
    adminCases = await caseStore.list();
    rebuildFlatDiseases();
    adminStore.notify();
  },
  async addCase(rec) {
    const saved = await caseStore.save(rec);
    await adminStore.refresh();
    return saved;
  },
  async deleteCase(id) {
    await caseStore.remove(id);
    await adminStore.refresh();
  },
};

export function findPath(slug) {
  const found = FLAT_DISEASES.find((f) => f.dis.slug === slug);
  if (!found) return null;
  return `${found.sys.slug}/${found.cat.slug}/${found.sub.slug}/${found.dis.slug}`;
}

// ---------------------------------------------------------------------------
// DIFFERENTIALS — kept in the store layer because paths resolve against the
// live FLAT_DISEASES array at load time.
// ---------------------------------------------------------------------------
export const DIFFERENTIALS = [
  {
    title: "Ring Enhancing Brain Lesions",
    slug: "ring-enhancing-brain-lesions",
    description: "The single most-used differential matrix in neuroradiology. Discriminating between these requires correlating diffusion, perfusion, and clinical context.",
    items: [
      { name: "Glioblastoma", path: findPath("glioblastoma"), discriminator: "Thick, irregular wall; markedly elevated rCBV at the margin." },
      { name: "Pyogenic Cerebral Abscess", path: findPath("pyogenic-cerebral-abscess"), discriminator: "Thin, smooth, complete wall; restricted diffusion centrally; low rCBV." },
      { name: "Metastasis", path: findPath("metastasis"), discriminator: "Often multiple, at the gray-white junction, with disproportionate edema." },
      { name: "Tumefactive Demyelination", path: findPath("tumefactive-demyelination"), discriminator: "Open-ring enhancement, the open side facing gray matter." },
      { name: "Primary CNS Lymphoma", path: findPath("primary-cns-lymphoma"), discriminator: "Homogeneous enhancement in immunocompetent hosts; ring pattern more common when immunocompromised." },
      { name: "Multiple Sclerosis (active plaque)", path: findPath("multiple-sclerosis"), discriminator: "Open-ring enhancement, periventricular, with Dawson's fingers elsewhere." },
    ],
  },
  {
    title: "Bilateral Ground-Glass Opacities",
    slug: "bilateral-ground-glass-opacities",
    description: "A high-yield chest differential separating cardiogenic from non-cardiogenic causes of diffuse opacification.",
    items: [
      { name: "ARDS", path: findPath("ards"), discriminator: "No cardiomegaly, gravity-dependent, acute precipitant within 1 week." },
      { name: "Cardiogenic Pulmonary Edema", path: null, discriminator: "Cardiomegaly, vascular redistribution, pleural effusions." },
      { name: "Usual Interstitial Pneumonia", path: findPath("usual-interstitial-pneumonia"), discriminator: "Basal, subpleural reticulation with honeycombing — chronic, not acute." },
    ],
  },
  {
    title: "Arterial Hyperenhancing Liver Lesions",
    slug: "arterial-enhancing-liver-lesions",
    description: "Lesions that light up on arterial phase imaging — the washout pattern on delayed phases is usually the deciding factor.",
    items: [
      { name: "Hepatocellular Carcinoma", path: findPath("hepatocellular-carcinoma"), discriminator: "Washes out on delayed phase; occurs in cirrhotic liver." },
      { name: "Focal Nodular Hyperplasia", path: findPath("focal-nodular-hyperplasia"), discriminator: "Central scar, no washout, isointense to liver on delayed phase." },
      { name: "Hepatic Adenoma", path: findPath("hepatic-adenoma"), discriminator: "Occurs in normal liver, often in women on OCPs; variable washout." },
    ],
  },
];

export function buildSearchIndex() {
  const idx = [];
  FLAT_DISEASES.forEach(({ sys, cat, sub, dis }) => {
    idx.push({
      type: "disease",
      title: dis.name,
      subtitle: `${sys.name} → ${cat.name} → ${sub.name}`,
      path: `${sys.slug}/${cat.slug}/${sub.slug}/${dis.slug}`,
      haystack: dis.name.toLowerCase(),
    });
    (dis.detail.keySigns || []).forEach((sign) => {
      idx.push({
        type: "sign",
        title: sign,
        subtitle: `Sign of ${dis.name}`,
        path: `${sys.slug}/${cat.slug}/${sub.slug}/${dis.slug}`,
        haystack: sign.toLowerCase(),
      });
    });
  });
  
  DIFFERENTIALS.forEach((d) => {
    idx.push({
      type: "differential",
      title: d.title,
      subtitle: "Differential diagnosis matrix",
      path: null,
      diffSlug: d.slug,
      haystack: d.title.toLowerCase(),
    });
  });
  return idx;
}

// ---------------------------------------------------------------------------
// PERSISTENCE BACKENDS — memory | indexeddb | api
// ---------------------------------------------------------------------------

export const ACTIVE_BACKEND = "api"; // "memory" | "indexeddb" | "api"
export const API_BASE_URL = "https://doctube-api.onrender.com/api";
export const ADMIN_LOCAL_PASSWORD = "doctube2026";

export function adminAuthHeader() {
  let token = null;
  try {
    token = localStorage.getItem("doctube_admin_token");
  } catch {
    /* sandboxed preview: no localStorage */
  }
  if (!token || token === "null" || token === "undefined") return {};
  return { Authorization: `Bearer ${token}` };
}

const memoryDB = { cases: new Map(), media: new Map() };
const memoryBackend = {
  async list() { return Array.from(memoryDB.cases.values()); },
  async save(caseRecord) {
    const record = { ...caseRecord, id: caseRecord.id || uid(), updatedAt: Date.now() };
    memoryDB.cases.set(record.id, record);
    return record;
  },
  async remove(id) { memoryDB.cases.delete(id); },
  async saveMedia(mediaFile) {
    const id = mediaFile.id || uid();
    const record = { id, name: mediaFile.name, type: mediaFile.type, mime: mediaFile.mime, blob: mediaFile.blob, createdAt: Date.now() };
    memoryDB.media.set(id, record);
    return { id, name: record.name, type: record.type, mime: record.mime };
  },
  async getMediaBlob(id) {
    const rec = memoryDB.media.get(id);
    return rec ? rec.blob : null;
  },
};

const DB_NAME = "doctube_admin";
const DB_VERSION = 1;
const STORE_CASES = "cases";
const STORE_MEDIA = "media";

function openDB() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) { reject(new Error("IndexedDB unavailable")); return; }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_CASES)) db.createObjectStore(STORE_CASES, { keyPath: "id" });
      if (!db.objectStoreNames.contains(STORE_MEDIA)) db.createObjectStore(STORE_MEDIA, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
function idbPut(storeName, value) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).put(value);
    tx.oncomplete = () => resolve(value);
    tx.onerror = () => reject(tx.error);
  }));
}
function idbGetAll(storeName) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  }));
}
function idbGet(storeName, id) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const req = tx.objectStore(storeName).get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  }));
}
function idbDelete(storeName, id) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).delete(id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  }));
}

const indexedDbBackend = {
  async list() {
    try { return await idbGetAll(STORE_CASES); } catch (e) { console.error("caseStore.list failed", e); return []; }
  },
  async save(caseRecord) {
    const record = { ...caseRecord, id: caseRecord.id || uid(), updatedAt: Date.now() };
    await idbPut(STORE_CASES, record);
    return record;
  },
  async remove(id) { await idbDelete(STORE_CASES, id); },
  async saveMedia(mediaFile) {
    const id = mediaFile.id || uid();
    const record = { id, name: mediaFile.name, type: mediaFile.type, mime: mediaFile.mime, blob: mediaFile.blob, createdAt: Date.now() };
    await idbPut(STORE_MEDIA, record);
    return { id, name: record.name, type: record.type, mime: record.mime };
  },
  async getMediaBlob(id) {
    try {
      const rec = await idbGet(STORE_MEDIA, id);
      return rec ? rec.blob : null;
    } catch (e) { console.error("caseStore.getMediaBlob failed", e); return null; }
  },
};

const apiBackend = {
  async list() {
    const res = await fetch(`${API_BASE_URL}/cases`);
    if (!res.ok) throw new Error("Failed to load cases from server");
    return res.json();
  },
  async save(caseRecord) {
    const res = await fetch(`${API_BASE_URL}/cases`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...adminAuthHeader() },
      body: JSON.stringify(caseRecord),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Failed to save case");
    }
    return res.json();
  },
  async remove(id) {
    const res = await fetch(`${API_BASE_URL}/cases/${id}`, {
      method: "DELETE",
      headers: adminAuthHeader(),
    });
    if (!res.ok) throw new Error("Failed to delete case");
  },
  async saveMedia(mediaFile) {
    const form = new FormData();
    form.append("file", mediaFile.blob, mediaFile.name);
    form.append("kind", mediaFile.type);
    if (mediaFile.studyLabel) form.append("studyLabel", mediaFile.studyLabel);
    const res = await fetch(`${API_BASE_URL}/media`, {
      method: "POST",
      headers: adminAuthHeader(),
      body: form,
    });
    if (!res.ok) throw new Error("Failed to upload media");
    return res.json();
  },
  async getMediaBlob(id) {
    const res = await fetch(`${API_BASE_URL}/media/${id}/url`);
    if (!res.ok) return null;
    const { url } = await res.json();
    const fileRes = await fetch(url);
    return fileRes.ok ? fileRes.blob() : null;
  },
};

export const caseStore =
  ACTIVE_BACKEND === "api"
    ? apiBackend
    : ACTIVE_BACKEND === "indexeddb"
    ? indexedDbBackend
    : memoryBackend;

export { FLAT_DISEASES ,TAXONOMY };
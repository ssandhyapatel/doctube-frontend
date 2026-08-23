import React, { useState, useEffect, useMemo, useRef } from "react";
import { ThemeProvider, useTheme, S, F } from "./styles/theme.jsx";
import { TAXONOMY, FLAT_DISEASES, adminStore, DIFFERENTIALS, buildSearchIndex } from "./services/store.js";
import { TEMPLATES } from "./data/templates.js";
import { AdminPanel } from "./components/AdminPanel.jsx";
import { MediaGallery } from "./components/MediaGallery.jsx";
import { Breadcrumb, EmptyState, Section } from "./components/ui.jsx";

// ---------------------------------------------------------------------------
// ROOT APP
// ---------------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}

function AppShell() {
  const [route, setRoute] = useState({ page: "home" });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [, forceTick] = useState(0);

  useEffect(() => {
    adminStore.refresh();
    return adminStore.subscribe(() => forceTick(t => t + 1));
  }, []);

  function nav(page, params = {}) {
    setRoute({ page, ...params });
    setSidebarOpen(window.innerWidth > 900);
  }

  return (
    <div style={S.appRoot}>
      <TopBar nav={nav} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} route={route} />
      <div style={S.body}>
        {sidebarOpen && <Sidebar nav={nav} route={route} />}
        <main style={S.main}>
          {route.page === "home" && <HomePage nav={nav} />}
          {route.page === "cases" && (
            <CasesIndex
              nav={nav}
              systemFilter={route.systemFilter}
              categoryFilter={route.categoryFilter}
              subcategoryFilter={route.subcategoryFilter}
            />
          )}
          {route.page === "disease" && <DiseasePage nav={nav} path={route.path} />}
          {route.page === "differentials" && <DifferentialsIndex nav={nav} />}
          {route.page === "differential" && <DifferentialPage nav={nav} slug={route.slug} />}
          {route.page === "templates" && <TemplatesPage nav={nav} />}
          {route.page === "calculators" && <CalculatorsPage nav={nav} />}
          {route.page === "admin" && <AdminPanel nav={nav} />}
        </main>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TOP BAR
// ---------------------------------------------------------------------------

function TopBar({ nav, sidebarOpen, setSidebarOpen, route }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <header style={S.topbar}>
      <div style={S.topbarLeft}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={S.iconBtn} title="Toggle tree">
          <BarsIcon />
        </button>
        <div onClick={() => nav("home")} style={S.brand}>
          <span style={S.brandMark}>dT</span>
          <div>
            <div style={S.brandName}>DOCTUBE</div>
            <div style={S.brandSub}>RADIOLOGY</div>
          </div>
        </div>
      </div>
      <nav style={S.topbarNav}>
        <TopBrowseMenu nav={nav} route={route} />
        {[
          ["Case Library", "cases"],
          ["Differentials", "differentials"],
          ["Templates", "templates"],
          ["Calculators", "calculators"],
        ].map(([label, page]) => (
          <button
            key={page}
            onClick={() => nav(page)}
            style={{ ...S.topbarLink, ...(route.page === page ? S.topbarLinkActive : {}) }}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => nav("admin")}
          style={{ ...S.topbarLink, ...(route.page === "admin" ? S.topbarLinkActive : {}) }}
          title="Doctor admin panel"
        >
          Admin
        </button>
        <button
          onClick={toggleTheme}
          style={S.themeToggleBtn}
          title={theme === "dark" ? "Switch to day mode" : "Switch to night mode"}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </nav>
    </header>
  );
}

// ---------------------------------------------------------------------------
// TOP BROWSE MENU
// ---------------------------------------------------------------------------

function TopBrowseMenu({ nav, route }) {
  const [open, setOpen] = useState(false);
  const [activeSys, setActiveSys] = useState(TAXONOMY[0]);
  const [activeCat, setActiveCat] = useState(TAXONOMY[0].categories[0]);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    function onKey(e) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onKey); };
  }, []);

  function pickSystem(sys) { setActiveSys(sys); setActiveCat(sys.categories[0]); }
  function go(page, params) { setOpen(false); nav(page, params); }

  const isActive = route.page === "cases" || route.page === "disease";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ ...S.topbarLink, ...S.browseTrigger, ...(isActive || open ? S.topbarLinkActive : {}) }}
      >
        Browse Taxonomy
        <Caret open={open} small />
      </button>

      {open && (
        <div style={S.megaMenu}>
          <div style={S.megaCol1}>
            <div style={S.megaColLabel}>System</div>
            {TAXONOMY.map(sys => (
              <button
                key={sys.slug}
                onMouseEnter={() => pickSystem(sys)}
                onClick={() => go("cases", { systemFilter: sys.slug })}
                style={{ ...S.megaSysRow, ...(activeSys.slug === sys.slug ? S.megaSysRowActive : {}) }}
              >
                <span style={S.megaSysIcon}>{sys.icon}</span>
                <span style={{ flex: 1 }}>{sys.name}</span>
                <span style={S.megaChevron}>›</span>
              </button>
            ))}
          </div>

          <div style={S.megaCol2}>
            <div style={S.megaColLabel}>Category</div>
            {activeSys.categories.map(cat => (
              <button
                key={cat.slug}
                onMouseEnter={() => setActiveCat(cat)}
                onClick={() => go("cases", { systemFilter: activeSys.slug, categoryFilter: cat.slug })}
                style={{ ...S.megaCatRow, ...(activeCat.slug === cat.slug ? S.megaCatRowActive : {}) }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div style={S.megaCol3}>
            <div style={S.megaColLabel}>Subcategory → Disease</div>
            <div style={S.megaCol3Scroll}>
              {activeCat.subcategories.map(sub => (
                <div key={sub.slug} style={S.megaSubBlock}>
                  <div style={S.megaSubHeading}>{sub.name}</div>
                  {sub.diseases.map(dis => (
                    <button
                      key={dis.slug}
                      onClick={() => go("disease", { path: `${activeSys.slug}/${activeCat.slug}/${sub.slug}/${dis.slug}` })}
                      style={S.megaDiseaseLink}
                    >
                      {dis.name}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SIDEBAR
// ---------------------------------------------------------------------------

function Sidebar({ nav, route }) {
  return (
    <aside style={S.sidebar}>
      <div style={S.sidebarSearchWrap}>
        <SearchBar nav={nav} compact />
      </div>
      <div style={S.sidebarScroll}>
        <div style={S.sidebarLabel}>Disease Explorer</div>
        {TAXONOMY.map(sys => (
          <SystemBranch key={sys.slug} sys={sys} nav={nav} activePath={route.path} />
        ))}
      </div>
    </aside>
  );
}

function SystemBranch({ sys, nav, activePath }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={S.treeBlock}>
      <div style={S.treeSystemRowWrap}>
        <button onClick={() => setOpen(!open)} style={S.treeSystemRow}>
          <Caret open={open} />
          <span style={S.treeSystemIcon}>{sys.icon}</span>
          <span style={S.treeSystemName}>{sys.name}</span>
        </button>
        <button
          onClick={() => nav("cases", { systemFilter: sys.slug })}
          style={S.treeJumpBtn}
          title={`Open ${sys.name} in Case Library`}
        >
          →
        </button>
      </div>
      {open && (
        <div style={S.treeIndent}>
          {sys.categories.map(cat => (
            <CategoryBranch key={cat.slug} sys={sys} cat={cat} nav={nav} activePath={activePath} />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryBranch({ sys, cat, nav, activePath }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div style={S.treeCategoryRowWrap}>
        <button onClick={() => setOpen(!open)} style={S.treeRowToggleArea}>
          <Caret open={open} small />
          <FolderIcon />
          <span style={S.treeCategoryName}>{cat.name}</span>
        </button>
        <button
          onClick={() => nav("cases", { systemFilter: sys.slug, categoryFilter: cat.slug })}
          style={S.treeJumpBtn}
          title={`Open ${cat.name} in Case Library`}
        >
          →
        </button>
      </div>
      {open && (
        <div style={S.treeIndent2}>
          {cat.subcategories.map(sub => (
            <SubcategoryBranch key={sub.slug} sys={sys} cat={cat} sub={sub} nav={nav} activePath={activePath} />
          ))}
        </div>
      )}
    </div>
  );
}

function SubcategoryBranch({ sys, cat, sub, nav, activePath }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button onClick={() => setOpen(!open)} style={S.treeSubRow}>
        <Caret open={open} tiny />
        <span style={S.treeSubName}>{sub.name}</span>
      </button>
      {open && (
        <div style={S.treeIndent3}>
          {sub.diseases.map(dis => {
            const path = `${sys.slug}/${cat.slug}/${sub.slug}/${dis.slug}`;
            const isActive = path === activePath;
            return (
              <button
                key={dis.slug}
                onClick={() => nav("disease", { path })}
                style={{ ...S.treeLeaf, ...(isActive ? S.treeLeafActive : {}) }}
              >
                <span style={S.treeLeafDot(isActive)} />
                {dis.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// -- Icons --
function Caret({ open, small, tiny }) {
  const size = tiny ? 8 : small ? 9 : 10;
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" style={{
      flexShrink: 0, transition: "transform .15s ease", transform: open ? "rotate(90deg)" : "rotate(0deg)",
    }}>
      <path d="M2 1 L8 5 L2 9 Z" fill="currentColor" />
    </svg>
  );
}
function FolderIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z" stroke="#caa35a" strokeWidth="1.6" />
    </svg>
  );
}
function BarsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SEARCH BAR
// ---------------------------------------------------------------------------

function SearchBar({ nav, compact }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    return buildSearchIndex().filter(r => r.haystack.includes(term)).slice(0, 8);
  }, [q]);

  function select(r) {
    setOpen(false); setQ("");
    if (r.type === "differential") nav("differential", { slug: r.diffSlug });
    else nav("disease", { path: r.path });
  }

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <div style={compact ? S.searchBoxCompact : S.searchBox}>
        <SearchIcon />
        <input
          value={q}
          onChange={e => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => q.length >= 2 && setOpen(true)}
          placeholder={compact ? "Search tree..." : "Search disease, finding, sign, or anatomy…"}
          style={compact ? S.searchInputCompact : S.searchInput}
        />
      </div>
      {open && results.length > 0 && (
        <div style={S.searchDropdown}>
          {results.map((r, i) => (
            <button key={i} onClick={() => select(r)} style={S.searchResultRow}>
              <span style={S.searchResultType(r.type)}>{r.type}</span>
              <span style={{ flex: 1, textAlign: "left" }}>
                <div style={S.searchResultTitle}>{r.title}</div>
                <div style={S.searchResultSub}>{r.subtitle}</div>
              </span>
            </button>
          ))}
        </div>
      )}
      {open && q.length >= 2 && results.length === 0 && (
        <div style={S.searchDropdown}>
          <div style={{ padding: "14px 16px", fontSize: 12.5, color: "#6b7280", fontFamily: F.mono }}>
            No matches for "{q}" in the current index.
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// HOME PAGE
// ---------------------------------------------------------------------------

function HomePage({ nav }) {
  const popular = ["Glioblastoma", "Hepatocellular Carcinoma", "ARDS", "Multiple Sclerosis", "Pancreatic Adenocarcinoma"];
  const systemCounts = TAXONOMY.map(sys => ({
    sys,
    count: sys.categories.reduce((a, c) => a + c.subcategories.reduce((a2, s) => a2 + s.diseases.length, 0), 0),
  }));

  return (
    <div style={S.homeWrap}>
      <div style={S.homeHero}>
        <div style={S.homeEyebrow}>A FIXED TAXONOMY, NOT A GROWING PILE</div>
        <h1 style={S.homeTitle}>Every disease has exactly<br />one address.</h1>
        <p style={S.homeSub}>
          DocTube indexes radiology by a strict System → Category → Subcategory → Disease
          hierarchy. No duplicate entries, no orphaned cases — if you know the disease, you
          already know where to find it.
        </p>
        <div style={S.homeSearchWrap}>
          <SearchBar nav={nav} />
        </div>
        <div style={S.popularRow}>
          <span style={S.popularLabel}>Popular:</span>
          {popular.map(p => {
            const found = FLAT_DISEASES.find(f => f.dis.name === p);
            return (
              <button
                key={p}
                onClick={() => found && nav("disease", { path: `${found.sys.slug}/${found.cat.slug}/${found.sub.slug}/${found.dis.slug}` })}
                style={S.popularChip}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      <div style={S.homeSection}>
        <div style={S.sectionHeading}>Browse by system</div>
        <div style={S.systemGrid}>
          {systemCounts.map(({ sys, count }) => (
            <button key={sys.slug} onClick={() => nav("cases", { systemFilter: sys.slug })} style={S.systemCard}>
              <span style={S.systemCardIcon}>{sys.icon}</span>
              <span style={S.systemCardName}>{sys.name}</span>
              <span style={S.systemCardCount}>{count} disease{count !== 1 ? "s" : ""} indexed</span>
            </button>
          ))}
        </div>
      </div>

      <div style={S.homeSection}>
        <div style={S.sectionHeading}>Core modules</div>
        <div style={S.moduleGrid}>
          <ModuleCard nav={nav} page="differentials" title="Differential Diagnosis" desc="Imaging-pattern matrices — ring-enhancing lesions, ground-glass opacities, and more — comparing look-alikes side by side." accent="#caa35a" />
          <ModuleCard nav={nav} page="templates" title="Reporting Templates" desc="Click-to-copy structured macros mapped to exact disease nodes, ready for your RIS/PACS workflow." accent="#7aa2f7" />
          <ModuleCard nav={nav} page="calculators" title="Calculators" desc="Live, interactive scoring — ASPECTS, Evans Index, and more — calculated client-side as you click." accent="#9ece6a" />
        </div>
      </div>
    </div>
  );
}

function ModuleCard({ nav, page, title, desc, accent }) {
  return (
    <button onClick={() => nav(page)} style={{ ...S.moduleCard, borderTopColor: accent }}>
      <div style={{ ...S.moduleCardTitle, color: accent }}>{title}</div>
      <div style={S.moduleCardDesc}>{desc}</div>
      <div style={{ ...S.moduleCardArrow, color: accent }}>Open →</div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// CASE LIBRARY INDEX
// ---------------------------------------------------------------------------

function CasesIndex({ nav, systemFilter, categoryFilter, subcategoryFilter }) {
  const activeSys = systemFilter ? TAXONOMY.find(s => s.slug === systemFilter) : null;
  const activeCat = activeSys && categoryFilter ? activeSys.categories.find(c => c.slug === categoryFilter) : null;
  const systems = activeSys ? [activeSys] : TAXONOMY;

  const crumbs = ["Case Library"];
  if (activeSys) crumbs.push(activeSys.name);
  if (activeCat) crumbs.push(activeCat.name);

  function onCrumb(i) {
    if (i === 0) nav("cases");
    else if (i === 1 && activeSys) nav("cases", { systemFilter: activeSys.slug });
  }

  const title = activeCat ? activeCat.name : activeSys ? activeSys.name : "Case Library";
  const lead = activeCat
    ? `Subcategories and disease nodes filed under ${activeSys.name} → ${activeCat.name}.`
    : activeSys
    ? `Every category and disease filed under ${activeSys.name}. Drill into a category, or clear the filter to see the full library.`
    : "Every entity below sits at exactly one location in the taxonomy. Expand the tree on the left, use Browse Taxonomy in the header, or browse by system here — all three stay in sync.";

  return (
    <div style={S.pageWrap}>
      <Breadcrumb crumbs={crumbs} onClick={onCrumb} />
      <div style={S.caseLibHeaderRow}>
        <h1 style={S.pageTitle}>{title}</h1>
        {(activeSys || activeCat) && (
          <button onClick={() => nav("cases")} style={S.clearFilterBtn}>Clear filter ×</button>
        )}
      </div>
      <p style={S.pageLead}>{lead}</p>
      <div style={{ marginTop: 28 }}>
        {systems.map(sys => (
          <div key={sys.slug} style={S.libSystemBlock}>
            <button onClick={() => nav("cases", { systemFilter: sys.slug })} style={S.libSystemHeadingBtn}>
              <span>{sys.icon}</span> {sys.name}
            </button>
            {(activeCat ? sys.categories.filter(c => c.slug === activeCat.slug) : sys.categories).map(cat => (
              <div key={cat.slug} style={S.libCategoryBlock}>
                <button
                  onClick={() => nav("cases", { systemFilter: sys.slug, categoryFilter: cat.slug })}
                  style={S.libCategoryHeadingBtn}
                >
                  {cat.name}
                </button>
                <div style={S.libDiseaseGrid}>
                  {cat.subcategories.flatMap(sub => sub.diseases.map(dis => (
                    <button
                      key={dis.slug}
                      onClick={() => nav("disease", { path: `${sys.slug}/${cat.slug}/${sub.slug}/${dis.slug}` })}
                      style={S.libDiseaseChip}
                    >
                      <span style={S.libDiseaseChipName}>{dis.name}</span>
                      <span style={S.libDiseaseChipSub}>{sub.name}</span>
                    </button>
                  )))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DISEASE PROFILE PAGE
// ---------------------------------------------------------------------------

function DiseasePage({ nav, path }) {
  const [tab, setTab] = useState("overview");
  if (!path) return <EmptyState text="No disease selected." />;
  const [sysSlug, catSlug, subSlug, disSlug] = path.split("/");
  const found = FLAT_DISEASES.find(f =>
    f.sys.slug === sysSlug && f.cat.slug === catSlug && f.sub.slug === subSlug && f.dis.slug === disSlug
  );
  if (!found) return <EmptyState text="This disease node could not be located in the taxonomy." />;

  const { sys, cat, sub, dis } = found;
  const d = dis.detail;
  const diffs = DIFFERENTIALS.filter(diff => d.differentials.includes(diff.slug));

  return (
    <div style={S.pageWrap}>
      <Breadcrumb
        crumbs={["Case Library", sys.name, cat.name, sub.name]}
        onClick={(i) => {
          if (i === 0) nav("cases");
          else if (i === 1) nav("cases", { systemFilter: sys.slug });
          else if (i === 2) nav("cases", { systemFilter: sys.slug, categoryFilter: cat.slug });
        }}
      />
      <div style={S.diseaseHeader}>
        <div>
          <h1 style={S.pageTitle}>{dis.name}</h1>
          <p style={S.pageLead}>Single source-of-truth profile — every section below maps to a fixed taxonomy node.</p>
        </div>
        <span style={S.diseaseBadge}>{sys.icon} {sys.name}</span>
      </div>

      <div style={S.diseaseGrid}>
        <div style={S.diseaseMain}>
          <div style={S.tabBar}>
            {[["overview", "Overview & Clinical"], ["imaging", "Imaging Findings"], ["pathology", "Pathology & Genetics"]].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} style={{ ...S.tabBtn, ...(tab === id ? S.tabBtnActive : {}) }}>
                {label}
              </button>
            ))}
          </div>

          <div style={S.tabPanel}>
            {tab === "overview" && (
              <>
                <Section label="Overview">{d.overview}</Section>
                <Section label="Epidemiology">{d.epidemiology}</Section>
                <Section label="Clinical Features">{d.features}</Section>
              </>
            )}
            {tab === "imaging" && (
              <>
                {d.media && d.media.length > 0 && <MediaGallery media={d.media} />}
                <div style={S.imagingGrid}>
                  {Object.entries(d.imaging).length === 0 && <div style={S.muted}>Imaging matrix pending authorship.</div>}
                  {Object.entries(d.imaging).map(([seq, val]) => (
                    <div key={seq} style={S.imagingRow}>
                      <div style={S.imagingSeq}>{seq.replace(/_/g, "/")}</div>
                      <div style={S.imagingVal}>{val}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {tab === "pathology" && (
              <>
                <Section label="Gross & Microscopic Pathology">{d.pathology}</Section>
                <Section label="Genetics & Molecular Markers">{d.genetics}</Section>
              </>
            )}
          </div>
        </div>

        <div style={S.diseaseSide}>
          {diffs.length > 0 && (
            <div style={S.sideCard}>
              <div style={S.sideCardHeading}>⚠ Critical Differentials</div>
              {diffs.map(diff => (
                <button key={diff.slug} onClick={() => nav("differential", { slug: diff.slug })} style={S.sideDiffRow}>
                  {diff.title}
                </button>
              ))}
            </div>
          )}

          {d.keySigns.length > 0 && (
            <div style={S.sideCard}>
              <div style={S.sideCardHeading}>Key Signs</div>
              <ul style={S.signList}>
                {d.keySigns.map((s, i) => <li key={i} style={S.signItem}>{s}</li>)}
              </ul>
            </div>
          )}

          <div style={{ ...S.sideCard, ...S.pearlsCard }}>
            <div style={{ ...S.sideCardHeading, color: "#caa35a" }}>Teaching Pearls</div>
            <p style={S.pearlsText}>{d.pearls}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DIFFERENTIAL DIAGNOSIS
// ---------------------------------------------------------------------------

function DifferentialsIndex({ nav }) {
  return (
    <div style={S.pageWrap}>
      <Breadcrumb crumbs={["Home", "Differential Diagnosis"]} onClick={(i) => i === 0 && nav("home")} />
      <h1 style={S.pageTitle}>Differential Diagnosis Matrices</h1>
      <p style={S.pageLead}>Imaging-pattern based comparisons, separate from individual disease pages — built for the moment you have a finding and need the full list of look-alikes.</p>
      <div style={{ marginTop: 28, display: "grid", gap: 16 }}>
        {DIFFERENTIALS.map(d => (
          <button key={d.slug} onClick={() => nav("differential", { slug: d.slug })} style={S.diffIndexCard}>
            <div style={S.diffIndexTitle}>{d.title}</div>
            <div style={S.diffIndexDesc}>{d.description}</div>
            <div style={S.diffIndexCount}>{d.items.length} candidates →</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function DifferentialPage({ nav, slug }) {
  const d = DIFFERENTIALS.find(x => x.slug === slug);
  if (!d) return <EmptyState text="Differential matrix not found." />;
  return (
    <div style={S.pageWrap}>
      <Breadcrumb crumbs={["Home", "Differential Diagnosis", d.title]} onClick={(i) => { if (i === 0) nav("home"); else if (i === 1) nav("differentials"); }} />
      <h1 style={S.pageTitle}>{d.title}</h1>
      <p style={S.pageLead}>{d.description}</p>
      <div style={{ marginTop: 28, display: "grid", gap: 14 }}>
        {d.items.map((item, i) => (
          <div key={i} style={S.diffItemRow}>
            <div>
              <div style={S.diffItemName}>{item.name}</div>
              <div style={S.diffItemDiscriminator}><span style={{ color: "#6b7280" }}>Key discriminator — </span>{item.discriminator}</div>
            </div>
            {item.path ? (
              <button onClick={() => nav("disease", { path: item.path })} style={S.diffItemBtn}>Open profile →</button>
            ) : (
              <span style={S.diffItemBtnDisabled}>Not yet indexed</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// REPORTING TEMPLATES
// ---------------------------------------------------------------------------

function TemplatesPage({ nav }) {
  return (
    <div style={S.pageWrap}>
      <Breadcrumb crumbs={["Home", "Reporting Templates"]} onClick={(i) => i === 0 && nav("home")} />
      <h1 style={S.pageTitle}>Structured Reporting Templates</h1>
      <p style={S.pageLead}>Standardized macros mapped to exact disease nodes. Copy the structured findings block directly into your RIS/PACS dictation.</p>
      <div style={{ marginTop: 28, display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))" }}>
        {TEMPLATES.map((t, i) => <TemplateCard key={i} template={t} />)}
      </div>
    </div>
  );
}

function TemplateCard({ template }) {
  const [copied, setCopied] = useState(false);

  function rawText() {
    const { history, technique, findings, impression } = template.content;
    let f = Object.entries(findings).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join("\n");
    return `CLINICAL HISTORY: ${history}\nTECHNIQUE: ${technique}\n\nFINDINGS:\n${f}\n\nIMPRESSION:\n${impression}`;
  }

  function copy() {
    const text = rawText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }).catch(() => fallbackCopy(text));
    } else fallbackCopy(text);
  }
  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch (e) {}
    document.body.removeChild(ta);
  }

  return (
    <div style={S.templateCard}>
      <div style={S.templateCardHeader}>
        <div>
          <span style={S.templateModalityTag}>{template.modality}</span>
          <div style={S.templateTitle}>{template.title}</div>
        </div>
        <button onClick={copy} style={{ ...S.templateCopyBtn, ...(copied ? S.templateCopyBtnDone : {}) }}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <div style={S.templateBody}>
        <TemplateRow label="Clinical History">{template.content.history}</TemplateRow>
        <TemplateRow label="Technique">{template.content.technique}</TemplateRow>
        <div style={S.templateFindingsLabel}>Findings</div>
        {Object.entries(template.content.findings).map(([k, v]) => (
          <div key={k} style={S.templateFindingRow}>
            <span style={S.templateFindingKey}>{k}</span>
            <span style={S.templateFindingVal}>{v}</span>
          </div>
        ))}
        <div style={S.templateImpression}><strong style={{ color: "#caa35a" }}>Impression — </strong>{template.content.impression}</div>
      </div>
    </div>
  );
}
function TemplateRow({ label, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <span style={S.templateFindingsLabel}>{label}</span>
      <div style={S.templateHistVal}>{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CALCULATORS
// ---------------------------------------------------------------------------

function CalculatorsPage({ nav }) {
  const [active, setActive] = useState("aspects");
  const menu = [
    { id: "aspects", name: "ASPECTS Score", sub: "Neuroradiology — Stroke" },
    { id: "evans", name: "Evans Index", sub: "Neuroradiology — Hydrocephalus" },
    { id: "childpugh", name: "Child-Pugh Score", sub: "Hepatobiliary — Cirrhosis" },
  ];
  return (
    <div style={S.pageWrap}>
      <Breadcrumb crumbs={["Home", "Calculators"]} onClick={(i) => i === 0 && nav("home")} />
      <h1 style={S.pageTitle}>Diagnostic Calculators</h1>
      <p style={S.pageLead}>Live, client-side scoring — results update instantly as you click.</p>
      <div style={S.calcLayout}>
        <div style={S.calcMenu}>
          {menu.map(m => (
            <button key={m.id} onClick={() => setActive(m.id)} style={{ ...S.calcMenuItem, ...(active === m.id ? S.calcMenuItemActive : {}) }}>
              <div style={S.calcMenuName}>{m.name}</div>
              <div style={S.calcMenuSub}>{m.sub}</div>
            </button>
          ))}
        </div>
        <div style={S.calcPanel}>
          {active === "aspects" && <AspectsCalculator />}
          {active === "evans" && <EvansCalculator />}
          {active === "childpugh" && <ChildPughCalculator />}
        </div>
      </div>
    </div>
  );
}

function AspectsCalculator() {
  const regions = [
    { id: "caudate", name: "Caudate Head", level: "Basal Ganglia Level" },
    { id: "lentiform", name: "Lentiform Nucleus", level: "Basal Ganglia Level" },
    { id: "ic", name: "Internal Capsule (posterior limb)", level: "Basal Ganglia Level" },
    { id: "insula", name: "Insular Cortex", level: "Basal Ganglia Level" },
    { id: "m1", name: "M1 — Anterior MCA cortex", level: "Basal Ganglia Level" },
    { id: "m2", name: "M2 — Lateral MCA cortex", level: "Basal Ganglia Level" },
    { id: "m3", name: "M3 — Posterior MCA cortex", level: "Basal Ganglia Level" },
    { id: "m4", name: "M4 — Anterior supraganglionic", level: "Supraganglionic Level" },
    { id: "m5", name: "M5 — Lateral supraganglionic", level: "Supraganglionic Level" },
    { id: "m6", name: "M6 — Posterior supraganglionic", level: "Supraganglionic Level" },
  ];
  const [checked, setChecked] = useState([]);
  const score = 10 - checked.length;
  const guidance = score === 10
    ? { text: "Normal non-contrast CT. No early ischemic change identified.", color: "#9ece6a" }
    : score >= 7
    ? { text: "Minimal to moderate ischemic change. Generally favorable for mechanical thrombectomy.", color: "#7aa2f7" }
    : { text: "Extensive ischemic burden (>1/3 MCA territory). Elevated risk of hemorrhagic transformation post-reperfusion.", color: "#f7768e" };

  return (
    <div>
      <div style={S.calcPanelHeader}>
        <div>
          <div style={S.calcPanelTitle}>ASPECTS</div>
          <div style={S.calcPanelDesc}>Alberta Stroke Program Early CT Score — deduct 1 point per region with early ischemic change.</div>
        </div>
        <button onClick={() => setChecked([])} style={S.resetBtn}>Reset</button>
      </div>
      <div style={S.calcGrid}>
        <div>
          {["Basal Ganglia Level", "Supraganglionic Level"].map(level => (
            <div key={level} style={{ marginBottom: 14 }}>
              <div style={S.calcGroupLabel}>{level}</div>
              {regions.filter(r => r.level === level).map(r => {
                const isChecked = checked.includes(r.id);
                return (
                  <label key={r.id} style={{ ...S.checkRow, ...(isChecked ? S.checkRowActive : {}) }}>
                    <span>{r.name}</span>
                    <input type="checkbox" checked={isChecked} onChange={() => setChecked(p => p.includes(r.id) ? p.filter(x => x !== r.id) : [...p, r.id])} style={S.checkbox} />
                  </label>
                );
              })}
            </div>
          ))}
        </div>
        <div style={S.scoreDisplay}>
          <div style={S.scoreLabel}>Score</div>
          <div style={{ ...S.scoreNumber, color: score >= 7 ? "#7aa2f7" : "#f7768e" }}>{score}<span style={S.scoreMax}>/10</span></div>
          <div style={{ ...S.guidanceBox, borderColor: guidance.color + "55" }}>
            <span style={{ color: guidance.color }}>{guidance.text}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EvansCalculator() {
  const [fhWidth, setFhWidth] = useState("");
  const [maxSkull, setMaxSkull] = useState("");
  const ratio = (fhWidth && maxSkull && Number(maxSkull) > 0) ? (Number(fhWidth) / Number(maxSkull)) : null;
  const abnormal = ratio !== null && ratio > 0.3;
  return (
    <div>
      <div style={S.calcPanelHeader}>
        <div>
          <div style={S.calcPanelTitle}>Evans Index</div>
          <div style={S.calcPanelDesc}>Ratio of maximum frontal horn width to maximum internal skull diameter, at the same axial level. A ratio &gt; 0.3 suggests ventriculomegaly.</div>
        </div>
      </div>
      <div style={S.calcGrid}>
        <div style={{ display: "grid", gap: 14 }}>
          <NumberField label="Max. frontal horn width (mm)" value={fhWidth} onChange={setFhWidth} />
          <NumberField label="Max. internal skull diameter (mm)" value={maxSkull} onChange={setMaxSkull} />
        </div>
        <div style={S.scoreDisplay}>
          <div style={S.scoreLabel}>Evans Index</div>
          <div style={{ ...S.scoreNumber, fontSize: 44, color: ratio === null ? "#6b7280" : abnormal ? "#f7768e" : "#9ece6a" }}>
            {ratio === null ? "—" : ratio.toFixed(3)}
          </div>
          <div style={{ ...S.guidanceBox, borderColor: ratio === null ? "#3a3f4a" : (abnormal ? "#f7768e55" : "#9ece6a55") }}>
            <span style={{ color: ratio === null ? "#6b7280" : abnormal ? "#f7768e" : "#9ece6a" }}>
              {ratio === null ? "Enter both measurements to calculate." : abnormal ? "Above 0.3 — suggestive of ventriculomegaly." : "Within normal limits (≤ 0.3)."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChildPughCalculator() {
  const [bilirubin, setBilirubin] = useState(1);
  const [albumin, setAlbumin] = useState(1);
  const [inr, setInr] = useState(1);
  const [ascites, setAscites] = useState(1);
  const [enceph, setEnceph] = useState(1);
  const total = bilirubin + albumin + inr + ascites + enceph;
  const cls = total <= 6 ? { label: "Class A", color: "#9ece6a", desc: "Well-compensated cirrhosis." }
    : total <= 9 ? { label: "Class B", color: "#caa35a", desc: "Significant functional compromise." }
    : { label: "Class C", color: "#f7768e", desc: "Decompensated cirrhosis." };

  const Selector = ({ label, value, onChange, options }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={S.calcGroupLabel}>{label}</div>
      <div style={{ display: "flex", gap: 6 }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => onChange(i + 1)} style={{ ...S.pillBtn, ...(value === i + 1 ? S.pillBtnActive : {}) }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div style={S.calcPanelHeader}>
        <div>
          <div style={S.calcPanelTitle}>Child-Pugh Score</div>
          <div style={S.calcPanelDesc}>Assesses severity of chronic liver disease / cirrhosis across five clinical and laboratory parameters.</div>
        </div>
      </div>
      <div style={S.calcGrid}>
        <div>
          <Selector label="Bilirubin (mg/dL)" value={bilirubin} onChange={setBilirubin} options={["<2", "2–3", ">3"]} />
          <Selector label="Albumin (g/dL)" value={albumin} onChange={setAlbumin} options={[">3.5", "2.8–3.5", "<2.8"]} />
          <Selector label="INR" value={inr} onChange={setInr} options={["<1.7", "1.7–2.3", ">2.3"]} />
          <Selector label="Ascites" value={ascites} onChange={setAscites} options={["None", "Mild", "Severe"]} />
          <Selector label="Encephalopathy" value={enceph} onChange={setEnceph} options={["None", "Grade I-II", "Grade III-IV"]} />
        </div>
        <div style={S.scoreDisplay}>
          <div style={S.scoreLabel}>Total Score</div>
          <div style={{ ...S.scoreNumber, color: cls.color }}>{total}</div>
          <div style={{ ...S.guidanceBox, borderColor: cls.color + "55" }}>
            <div style={{ fontWeight: 700, color: cls.color, marginBottom: 4 }}>{cls.label}</div>
            <span style={{ color: cls.color }}>{cls.desc}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange }) {
  return (
    <div>
      <div style={S.calcGroupLabel}>{label}</div>
      <input type="number" value={value} onChange={e => onChange(e.target.value)} style={S.numberInput} placeholder="0" />
    </div>
  );
}
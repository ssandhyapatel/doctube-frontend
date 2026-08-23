import React, { useState, useEffect, useContext } from "react";

// ---------------------------------------------------------------------------
// STYLE TOKENS
// ---------------------------------------------------------------------------

export const F = {
  display: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif",
  mono: "'IBM Plex Mono', 'SF Mono', Menlo, monospace",
};

// Two palettes, same token names, so every existing S.xxx reference below
// keeps working untouched — only the *values* swap when theme flips.
export const THEMES = {
  dark: {
    bg: "#0d1016",
    bgPanel: "#13161f",
    bgPanel2: "#171a24",
    border: "#262a36",
    borderSoft: "#1d212b",
    text: "#e3e5ea",
    textMute: "#9aa1b2",
    textFaint: "#6b7280",
    amber: "#caa35a",
    blue: "#7aa2f7",
    green: "#9ece6a",
    red: "#f7768e",
  },
  light: {
    bg: "#f4f3ef",
    bgPanel: "#ffffff",
    bgPanel2: "#f0eee8",
    border: "#dcd8cd",
    borderSoft: "#e6e3da",
    text: "#1d1c18",
    textMute: "#5b574c",
    textFaint: "#8b8678",
    amber: "#9c6f1f",
    blue: "#2f5fd6",
    green: "#3f8f4a",
    red: "#c4364f",
  },
}; //[cite: 2]

export function buildStyles(COLOR) {
  const S = {
    appRoot: { fontFamily: F.display, background: COLOR.bg, color: COLOR.text, minHeight: "100vh", display: "flex", flexDirection: "column" },
    body: { display: "flex", flex: 1, minHeight: 0 },

    topbar: { height: 60, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", borderBottom: `1px solid ${COLOR.border}`, background: COLOR.bgPanel, position: "sticky", top: 0, zIndex: 20 },
    topbarLeft: { display: "flex", alignItems: "center", gap: 14 },
    iconBtn: { background: "transparent", border: "none", color: COLOR.textMute, cursor: "pointer", padding: 6, borderRadius: 6, display: "flex" },
    brand: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
    brandMark: { width: 30, height: 30, borderRadius: 7, background: COLOR.amber, color: "#1a1306", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.mono },
    brandName: { fontWeight: 700, fontSize: 14, letterSpacing: "0.04em", lineHeight: 1.1 },
    brandSub: { fontSize: 9.5, color: COLOR.textFaint, letterSpacing: "0.14em", fontFamily: F.mono },
    topbarNav: { display: "flex", gap: 4 },
    topbarLink: { background: "transparent", border: "none", color: COLOR.textMute, fontSize: 13, padding: "8px 13px", borderRadius: 7, cursor: "pointer", fontWeight: 500 },
    topbarLinkActive: { color: COLOR.amber, background: "rgba(202,163,90,0.1)" },
    browseTrigger: { display: "flex", alignItems: "center", gap: 6 },
    themeToggleBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, marginLeft: 4, background: COLOR.bgPanel2, border: `1px solid ${COLOR.border}`, borderRadius: 8, color: COLOR.amber, cursor: "pointer" },

    megaMenu: { position: "absolute", top: "calc(100% + 10px)", left: 0, display: "flex", background: COLOR.bgPanel2, border: `1px solid ${COLOR.border}`, borderRadius: 12, boxShadow: "0 22px 50px rgba(0,0,0,0.5)", overflow: "hidden", zIndex: 60, minWidth: 720 },
    megaColLabel: { fontSize: 10, fontFamily: F.mono, color: COLOR.textFaint, textTransform: "uppercase", letterSpacing: "0.1em", padding: "12px 14px 8px" },
    megaCol1: { width: 220, borderRight: `1px solid ${COLOR.border}`, display: "flex", flexDirection: "column", paddingBottom: 8, maxHeight: 460, overflowY: "auto" },
    megaSysRow: { display: "flex", alignItems: "center", gap: 9, width: "100%", background: "transparent", border: "none", color: COLOR.textMute, fontSize: 12.5, padding: "9px 14px", cursor: "pointer", textAlign: "left" },
    megaSysRowActive: { color: COLOR.amber, background: "rgba(202,163,90,0.08)" },
    megaSysIcon: { fontSize: 14 },
    megaChevron: { marginLeft: "auto", color: COLOR.textFaint, fontSize: 13 },
    megaCol2: { width: 230, borderRight: `1px solid ${COLOR.border}`, display: "flex", flexDirection: "column", paddingBottom: 8, maxHeight: 460, overflowY: "auto" },
    megaCatRow: { width: "100%", background: "transparent", border: "none", color: COLOR.textMute, fontSize: 12, padding: "8px 14px", cursor: "pointer", textAlign: "left", fontFamily: F.mono },
    megaCatRowActive: { color: COLOR.amber, background: "rgba(202,163,90,0.08)" },
    megaCol3: { width: 290, display: "flex", flexDirection: "column" },
    megaCol3Scroll: { maxHeight: 460, overflowY: "auto", paddingBottom: 8 },
    megaSubBlock: { padding: "0 14px 10px" },
    megaSubHeading: { fontSize: 10.5, fontFamily: F.mono, color: COLOR.textFaint, textTransform: "uppercase", letterSpacing: "0.05em", margin: "8px 0 4px" },
    megaDiseaseLink: { display: "block", width: "100%", background: "transparent", border: "none", color: COLOR.text, fontSize: 12.5, padding: "5px 8px", cursor: "pointer", textAlign: "left", borderRadius: 5 },

    sidebar: { width: 300, flexShrink: 0, borderRight: `1px solid ${COLOR.border}`, background: COLOR.bgPanel, display: "flex", flexDirection: "column", height: "calc(100vh - 60px)", position: "sticky", top: 60 },
    sidebarSearchWrap: { padding: 14, borderBottom: `1px solid ${COLOR.borderSoft}` },
    sidebarScroll: { flex: 1, overflowY: "auto", padding: "14px 10px" },
    sidebarLabel: { fontSize: 10.5, fontFamily: F.mono, color: COLOR.textFaint, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 8px", marginBottom: 10 },

    treeBlock: { marginBottom: 2 },
    treeSystemRowWrap: { width: "100%", display: "flex", alignItems: "center", gap: 2 },
    treeSystemRow: { flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 7, background: "transparent", border: "none", color: COLOR.text, fontSize: 12.5, fontWeight: 700, padding: "7px 8px", borderRadius: 6, cursor: "pointer", textAlign: "left", fontFamily: F.mono, letterSpacing: "0.02em" },
    treeSystemIcon: { fontSize: 13 },
    treeSystemName: {},
    treeIndent: { marginLeft: 14, borderLeft: `1px solid ${COLOR.border}`, paddingLeft: 8 },
    treeCategoryRowWrap: { width: "100%", display: "flex", alignItems: "center", gap: 2 },
    treeRowToggleArea: { flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: COLOR.textMute, fontSize: 12, fontWeight: 500, padding: "5px 6px", borderRadius: 5, cursor: "pointer", textAlign: "left", fontFamily: F.mono },
    treeCategoryRow: { width: "100%", display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: COLOR.textMute, fontSize: 12, fontWeight: 500, padding: "5px 6px", borderRadius: 5, cursor: "pointer", textAlign: "left", fontFamily: F.mono },
    treeCategoryName: {},
    treeJumpBtn: { flexShrink: 0, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: `1px solid ${COLOR.borderSoft}`, color: COLOR.textFaint, borderRadius: 5, cursor: "pointer", fontSize: 11, lineHeight: 1, marginRight: 4 },
    treeIndent2: { marginLeft: 10, borderLeft: `1px solid ${COLOR.borderSoft}`, paddingLeft: 8 },
    treeSubRow: { width: "100%", display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: COLOR.textFaint, fontSize: 11.5, fontStyle: "italic", padding: "4px 6px", borderRadius: 5, cursor: "pointer", textAlign: "left", fontFamily: F.mono },
    treeSubName: {},
    treeIndent3: { marginLeft: 10, paddingLeft: 8 },
    treeLeaf: { width: "100%", display: "flex", alignItems: "center", gap: 7, background: "transparent", border: "none", color: COLOR.textMute, fontSize: 12, padding: "5px 6px", borderRadius: 5, cursor: "pointer", textAlign: "left", fontFamily: F.mono },
    treeLeafActive: { color: COLOR.amber, background: "rgba(202,163,90,0.08)", fontWeight: 600 },
    treeLeafDot: (active) => ({ width: 5, height: 5, borderRadius: "50%", background: active ? COLOR.amber : "#3a3f4a", flexShrink: 0 }),

    searchBox: { display: "flex", alignItems: "center", gap: 10, background: COLOR.bgPanel2, border: `1px solid ${COLOR.border}`, borderRadius: 10, padding: "13px 16px", color: COLOR.textFaint },
    searchBoxCompact: { display: "flex", alignItems: "center", gap: 8, background: COLOR.bgPanel2, border: `1px solid ${COLOR.border}`, borderRadius: 8, padding: "9px 11px", color: COLOR.textFaint },
    searchInput: { flex: 1, background: "transparent", border: "none", outline: "none", color: COLOR.text, fontSize: 14, fontFamily: F.display },
    searchInputCompact: { flex: 1, background: "transparent", border: "none", outline: "none", color: COLOR.text, fontSize: 12.5, fontFamily: F.display },
    searchDropdown: { position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: COLOR.bgPanel2, border: `1px solid ${COLOR.border}`, borderRadius: 10, overflow: "hidden", boxShadow: "0 18px 40px rgba(0,0,0,0.45)", zIndex: 60, maxHeight: 360, overflowY: "auto" },
    searchResultRow: { width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "transparent", border: "none", borderBottom: `1px solid ${COLOR.borderSoft}`, cursor: "pointer" },
    searchResultType: (type) => ({
      fontSize: 9, fontFamily: F.mono, textTransform: "uppercase", letterSpacing: "0.06em", padding: "3px 7px", borderRadius: 4, flexShrink: 0,
      color: type === "disease" ? COLOR.green : type === "sign" ? COLOR.amber : COLOR.red,
      background: type === "disease" ? "rgba(158,206,106,0.12)" : type === "sign" ? "rgba(202,163,90,0.12)" : "rgba(247,118,142,0.12)",
    }),
    searchResultTitle: { fontSize: 13, color: COLOR.text, fontWeight: 500 },
    searchResultSub: { fontSize: 11, color: COLOR.textFaint, fontFamily: F.mono, marginTop: 1 },

    main: { flex: 1, minWidth: 0, overflowY: "auto" },

    homeWrap: { display: "flex", flexDirection: "column" },
    homeHero: { padding: "72px 32px 48px", textAlign: "center", borderBottom: `1px solid ${COLOR.borderSoft}`, background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(202,163,90,0.07), transparent)" },
    homeEyebrow: { fontFamily: F.mono, fontSize: 11, letterSpacing: "0.18em", color: COLOR.amber, marginBottom: 18 },
    homeTitle: { fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, lineHeight: 1.12, margin: "0 0 18px", letterSpacing: "-0.01em" },
    homeSub: { fontSize: 15.5, color: COLOR.textMute, maxWidth: 620, margin: "0 auto 36px", lineHeight: 1.6 },
    homeSearchWrap: { maxWidth: 640, margin: "0 auto" },
    popularRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap", marginTop: 22 },
    popularLabel: { fontSize: 12, color: COLOR.textFaint, fontFamily: F.mono, marginRight: 4 },
    popularChip: { fontSize: 12.5, color: COLOR.textMute, background: COLOR.bgPanel2, border: `1px solid ${COLOR.border}`, borderRadius: 20, padding: "6px 14px", cursor: "pointer" },

    homeSection: { padding: "44px 32px", borderBottom: `1px solid ${COLOR.borderSoft}` },
    sectionHeading: { fontSize: 12, fontFamily: F.mono, color: COLOR.textFaint, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20, maxWidth: 1100, margin: "0 auto 20px" },

    systemGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14, maxWidth: 1100, margin: "0 auto" },
    systemCard: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6, background: COLOR.bgPanel, border: `1px solid ${COLOR.border}`, borderRadius: 12, padding: "20px 18px", cursor: "pointer", textAlign: "left" },
    systemCardIcon: { fontSize: 22 },
    systemCardName: { fontSize: 14, fontWeight: 600, color: COLOR.text, marginTop: 4 },
    systemCardCount: { fontSize: 11.5, color: COLOR.textFaint, fontFamily: F.mono },

    moduleGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, maxWidth: 1100, margin: "0 auto" },
    moduleCard: { background: COLOR.bgPanel, border: `1px solid ${COLOR.border}`, borderTop: "3px solid", borderRadius: 10, padding: "22px 20px", textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 10 },
    moduleCardTitle: { fontSize: 15, fontWeight: 700 },
    moduleCardDesc: { fontSize: 12.5, color: COLOR.textMute, lineHeight: 1.55 },
    moduleCardArrow: { fontSize: 12, fontFamily: F.mono, marginTop: 4 },

    pageWrap: { padding: "32px 36px 80px", maxWidth: 1180, margin: "0 auto" },
    breadcrumb: { display: "flex", gap: 7, fontSize: 11.5, fontFamily: F.mono, color: COLOR.textFaint, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.04em", flexWrap: "wrap" },
    breadcrumbLink: { background: "transparent", border: "none", color: COLOR.textFaint, fontSize: 11.5, fontFamily: F.mono, textTransform: "uppercase", letterSpacing: "0.04em", cursor: "pointer", padding: 0 },
    breadcrumbCurrent: { color: COLOR.amber },
    pageTitle: { fontSize: 28, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.01em" },
    pageLead: { fontSize: 14, color: COLOR.textMute, maxWidth: 720, lineHeight: 1.55, margin: 0 },

    caseLibHeaderRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" },
    clearFilterBtn: { background: "transparent", border: `1px solid ${COLOR.border}`, color: COLOR.textMute, borderRadius: 7, padding: "7px 13px", fontSize: 12, cursor: "pointer", fontFamily: F.mono, flexShrink: 0, marginTop: 4 },

    libSystemBlock: { marginBottom: 36 },
    libSystemHeading: { fontSize: 16, fontWeight: 700, color: COLOR.amber, marginBottom: 14, display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${COLOR.borderSoft}`, paddingBottom: 10 },
    libSystemHeadingBtn: { fontSize: 16, fontWeight: 700, color: COLOR.amber, marginBottom: 14, display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${COLOR.borderSoft}`, paddingBottom: 10, width: "100%", background: "transparent", border: "none", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: COLOR.borderSoft, cursor: "pointer", textAlign: "left", fontFamily: F.display },
    libCategoryBlock: { marginBottom: 18, paddingLeft: 8 },
    libCategoryHeading: { fontSize: 12.5, fontFamily: F.mono, color: COLOR.textFaint, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 },
    libCategoryHeadingBtn: { fontSize: 12.5, fontFamily: F.mono, color: COLOR.textFaint, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, background: "transparent", border: "none", cursor: "pointer", padding: 0, display: "block" },
    libDiseaseGrid: { display: "flex", flexWrap: "wrap", gap: 8 },
    libDiseaseChip: { display: "flex", flexDirection: "column", gap: 2, background: COLOR.bgPanel, border: `1px solid ${COLOR.border}`, borderRadius: 8, padding: "9px 13px", cursor: "pointer", textAlign: "left" },
    libDiseaseChipName: { fontSize: 12.5, color: COLOR.text, fontWeight: 500 },
    libDiseaseChipSub: { fontSize: 10, color: COLOR.textFaint, fontFamily: F.mono },

    diseaseHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 8, flexWrap: "wrap" },
    diseaseBadge: { fontSize: 11.5, fontFamily: F.mono, color: COLOR.textMute, background: COLOR.bgPanel2, border: `1px solid ${COLOR.border}`, borderRadius: 8, padding: "7px 13px", whiteSpace: "nowrap" },

    diseaseGrid: { display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(260px,1fr)", gap: 26, marginTop: 28 },
    diseaseMain: {},
    diseaseSide: { display: "flex", flexDirection: "column", gap: 16 },

    tabBar: { display: "flex", borderBottom: `1px solid ${COLOR.border}`, background: COLOR.bgPanel, borderRadius: "10px 10px 0 0", overflow: "hidden" },
    tabBtn: { flex: 1, padding: "13px 14px", background: "transparent", border: "none", color: COLOR.textMute, fontSize: 12, fontFamily: F.mono, textTransform: "uppercase", letterSpacing: "0.03em", cursor: "pointer", borderBottom: "2px solid transparent" },
    tabBtnActive: { color: COLOR.amber, borderBottomColor: COLOR.amber, background: COLOR.bgPanel2 },
    tabPanel: { background: COLOR.bgPanel, border: `1px solid ${COLOR.border}`, borderTop: "none", borderRadius: "0 0 10px 10px", padding: 24 },

    sectionLabel: { fontSize: 11, fontFamily: F.mono, color: COLOR.textFaint, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 },
    sectionBody: { fontSize: 13.5, color: COLOR.text, lineHeight: 1.65, margin: 0 },

    imagingGrid: { display: "flex", flexDirection: "column", gap: 10 },
    imagingRow: { display: "grid", gridTemplateColumns: "130px 1fr", gap: 14, padding: "10px 0", borderBottom: `1px solid ${COLOR.borderSoft}` },
    imagingSeq: { fontSize: 12, fontFamily: F.mono, color: COLOR.blue, fontWeight: 600, paddingTop: 1 },
    imagingVal: { fontSize: 13, color: COLOR.text, lineHeight: 1.55 },

    sideCard: { background: COLOR.bgPanel, border: `1px solid ${COLOR.border}`, borderRadius: 10, padding: 18 },
    sideCardHeading: { fontSize: 11.5, fontFamily: F.mono, textTransform: "uppercase", letterSpacing: "0.06em", color: COLOR.textMute, marginBottom: 12 },
    sideDiffRow: { width: "100%", textAlign: "left", background: COLOR.bgPanel2, border: `1px solid ${COLOR.border}`, borderRadius: 7, padding: "10px 12px", color: COLOR.text, fontSize: 12.5, cursor: "pointer", marginBottom: 6, fontFamily: F.mono },
    signList: { margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 7 },
    signItem: { fontSize: 12.5, color: COLOR.text, lineHeight: 1.5 },
    pearlsCard: { background: "linear-gradient(180deg, rgba(202,163,90,0.08), transparent)", borderColor: "rgba(202,163,90,0.25)" },
    pearlsText: { fontSize: 12.5, color: COLOR.text, lineHeight: 1.65, margin: 0 },

    diffIndexCard: { display: "flex", flexDirection: "column", gap: 8, textAlign: "left", background: COLOR.bgPanel, border: `1px solid ${COLOR.border}`, borderRadius: 12, padding: "20px 22px", cursor: "pointer" },
    diffIndexTitle: { fontSize: 16, fontWeight: 700, color: COLOR.text },
    diffIndexDesc: { fontSize: 12.5, color: COLOR.textMute, lineHeight: 1.55, maxWidth: 700 },
    diffIndexCount: { fontSize: 11.5, color: COLOR.red, fontFamily: F.mono, marginTop: 4 },

    diffItemRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, background: COLOR.bgPanel, border: `1px solid ${COLOR.border}`, borderRadius: 10, padding: "16px 20px", flexWrap: "wrap" },
    diffItemName: { fontSize: 14.5, fontWeight: 600, color: COLOR.text, marginBottom: 4 },
    diffItemDiscriminator: { fontSize: 12.5, color: COLOR.textMute, lineHeight: 1.5, maxWidth: 600 },
    diffItemBtn: { background: "transparent", border: `1px solid ${COLOR.amber}55`, color: COLOR.amber, borderRadius: 7, padding: "8px 14px", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", fontFamily: F.mono },
    diffItemBtnDisabled: { fontSize: 11.5, color: COLOR.textFaint, fontFamily: F.mono, fontStyle: "italic" },

    templateCard: { background: COLOR.bgPanel, border: `1px solid ${COLOR.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" },
    templateCardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px 18px", borderBottom: `1px solid ${COLOR.border}`, background: COLOR.bgPanel2 },
    templateModalityTag: { fontSize: 10, fontFamily: F.mono, color: COLOR.blue, background: "rgba(122,162,247,0.12)", border: "1px solid rgba(122,162,247,0.25)", borderRadius: 5, padding: "3px 8px", textTransform: "uppercase", letterSpacing: "0.05em" },
    templateTitle: { fontSize: 13.5, fontWeight: 600, color: COLOR.text, marginTop: 8 },
    templateCopyBtn: { background: COLOR.bgPanel, border: `1px solid ${COLOR.border}`, color: COLOR.textMute, borderRadius: 7, padding: "7px 14px", fontSize: 12, cursor: "pointer", fontWeight: 600, flexShrink: 0 },
    templateCopyBtnDone: { color: COLOR.green, borderColor: COLOR.green + "55", background: "rgba(158,206,106,0.1)" },
    templateBody: { padding: 18, fontSize: 12.5, color: COLOR.textMute, lineHeight: 1.55, fontFamily: F.mono, flex: 1 },
    templateFindingsLabel: { fontSize: 10.5, color: COLOR.textFaint, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4, display: "block" },
    templateHistVal: { color: COLOR.text, marginBottom: 4 },
    templateFindingRow: { display: "grid", gridTemplateColumns: "120px 1fr", gap: 10, padding: "6px 0", borderBottom: `1px solid ${COLOR.borderSoft}` },
    templateFindingKey: { color: COLOR.amber, fontSize: 11, textTransform: "uppercase" },
    templateFindingVal: { color: COLOR.text },
    templateImpression: { marginTop: 12, padding: "12px 14px", background: COLOR.bgPanel2, borderRadius: 8, color: COLOR.text, fontFamily: F.display, fontSize: 13, lineHeight: 1.55 },

    calcLayout: { display: "grid", gridTemplateColumns: "260px 1fr", gap: 24, marginTop: 28 },
    calcMenu: { display: "flex", flexDirection: "column", gap: 8 },
    calcMenuItem: { textAlign: "left", background: COLOR.bgPanel, border: `1px solid ${COLOR.border}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer" },
    calcMenuItemActive: { borderColor: COLOR.amber + "66", background: "rgba(202,163,90,0.08)" },
    calcMenuName: { fontSize: 13, fontWeight: 600, color: COLOR.text },
    calcMenuSub: { fontSize: 10.5, color: COLOR.textFaint, fontFamily: F.mono, marginTop: 3, textTransform: "uppercase", letterSpacing: "0.04em" },
    calcPanel: { background: COLOR.bgPanel, border: `1px solid ${COLOR.border}`, borderRadius: 12, padding: 26 },
    calcPanelHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, gap: 14, flexWrap: "wrap" },
    calcPanelTitle: { fontSize: 17, fontWeight: 700, color: COLOR.text },
    calcPanelDesc: { fontSize: 12.5, color: COLOR.textMute, marginTop: 5, lineHeight: 1.55, maxWidth: 520 },
    resetBtn: { background: "transparent", border: `1px solid ${COLOR.border}`, color: COLOR.textMute, borderRadius: 7, padding: "7px 13px", fontSize: 12, cursor: "pointer" },
    calcGrid: { display: "grid", gridTemplateColumns: "1fr 260px", gap: 28 },
    calcGroupLabel: { fontSize: 11, fontFamily: F.mono, color: COLOR.textFaint, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 },
    checkRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", border: `1px solid ${COLOR.border}`, borderRadius: 7, fontSize: 12.5, color: COLOR.textMute, marginBottom: 5, cursor: "pointer" },
    checkRowActive: { borderColor: COLOR.red + "55", background: "rgba(247,118,142,0.08)", color: COLOR.red },
    checkbox: { width: 14, height: 14, accentColor: COLOR.red },
    scoreDisplay: { background: COLOR.bgPanel2, border: `1px solid ${COLOR.border}`, borderRadius: 12, padding: 22, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", height: "fit-content" },
    scoreLabel: { fontSize: 11, fontFamily: F.mono, color: COLOR.textFaint, textTransform: "uppercase", letterSpacing: "0.08em" },
    scoreNumber: { fontSize: 56, fontWeight: 800, lineHeight: 1, margin: "10px 0" },
    scoreMax: { fontSize: 20, color: COLOR.textFaint, fontWeight: 500 },
    guidanceBox: { border: "1px solid", borderRadius: 8, padding: "12px 14px", fontSize: 12, lineHeight: 1.55, marginTop: 6 },
    numberInput: { width: "100%", background: COLOR.bgPanel2, border: `1px solid ${COLOR.border}`, borderRadius: 7, padding: "10px 12px", color: COLOR.text, fontSize: 13, fontFamily: F.mono, outline: "none" },
    pillBtn: { flex: 1, background: COLOR.bgPanel2, border: `1px solid ${COLOR.border}`, color: COLOR.textMute, borderRadius: 7, padding: "8px 6px", fontSize: 11.5, cursor: "pointer" },
    pillBtnActive: { borderColor: COLOR.amber + "66", color: COLOR.amber, background: "rgba(202,163,90,0.1)" },

    muted: { color: COLOR.textFaint, fontSize: 13, padding: "40px 0" },

    dicomViewer: { background: "#000", border: `1px solid ${COLOR.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 14 },
    dicomCanvasWrap: { position: "relative", width: "100%", aspectRatio: "1 / 1", maxHeight: 560, background: "#000", overflow: "hidden", cursor: "crosshair", outline: "none", display: "flex", alignItems: "center", justifyContent: "center" },
    dicomCanvas: { maxWidth: "100%", maxHeight: "100%", imageRendering: "pixelated", userSelect: "none" },
    dicomOverlayTopLeft: { position: "absolute", top: 10, left: 12, color: "#9ece6a", fontFamily: F.mono, fontSize: 11, lineHeight: 1.5, textShadow: "0 1px 2px rgba(0,0,0,0.9)", pointerEvents: "none" },
    dicomOverlayTopRight: { position: "absolute", top: 10, right: 12, color: "#9ece6a", fontFamily: F.mono, fontSize: 11, lineHeight: 1.5, textShadow: "0 1px 2px rgba(0,0,0,0.9)", pointerEvents: "none", textAlign: "right" },
    dicomOverlayBottomLeft: { position: "absolute", bottom: 10, left: 12, color: "#9ece6a", fontFamily: F.mono, fontSize: 11, lineHeight: 1.5, textShadow: "0 1px 2px rgba(0,0,0,0.9)", pointerEvents: "none" },
    dicomOverlayBottomRight: { position: "absolute", bottom: 10, right: 12, color: "#9ece6a", fontFamily: F.mono, fontSize: 11, lineHeight: 1.5, textShadow: "0 1px 2px rgba(0,0,0,0.9)", pointerEvents: "none", textAlign: "right" },
    dicomControls: { padding: "10px 14px", background: "#0a0a0a", borderTop: "1px solid #1c1c1c" },
    dicomSlider: { width: "100%", accentColor: COLOR.amber },
    dicomControlsRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 6, flexWrap: "wrap" },
    dicomBtn: { background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#ccc", borderRadius: 6, padding: "5px 12px", fontSize: 11.5, cursor: "pointer", fontFamily: F.mono },
    dicomHint: { fontSize: 10.5, color: "#777", fontFamily: F.mono },
    dicomLoading: { padding: "32px 0", textAlign: "center", color: COLOR.textFaint, fontSize: 13, fontFamily: F.mono },
    dicomError: { padding: 20, background: "rgba(247,118,142,0.07)", border: `1px solid ${COLOR.red}44`, borderRadius: 10, marginBottom: 14 },
    dicomErrorTitle: { color: COLOR.red, fontWeight: 700, fontSize: 13, marginBottom: 6 },
    dicomErrorBody: { color: COLOR.textMute, fontSize: 12.5, lineHeight: 1.55 },

    mediaGallery: { marginBottom: 22, display: "flex", flexDirection: "column", gap: 18 },
    mediaStudyBlock: { display: "flex", flexDirection: "column", gap: 8 },
    mediaStudyLabel: { fontSize: 11, fontFamily: F.mono, color: COLOR.textFaint, textTransform: "uppercase", letterSpacing: "0.08em" },
    mediaDicomSlot: {},
    mediaThumbGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 },
    mediaImage: { width: "100%", borderRadius: 8, border: `1px solid ${COLOR.border}`, display: "block", objectFit: "cover", aspectRatio: "4 / 3" },
    mediaVideo: { width: "100%", borderRadius: 8, border: `1px solid ${COLOR.border}`, display: "block" },
    mediaThumbLoading: { aspectRatio: "4 / 3", display: "flex", alignItems: "center", justifyContent: "center", background: COLOR.bgPanel2, border: `1px solid ${COLOR.border}`, borderRadius: 8, color: COLOR.textFaint, fontSize: 11.5, fontFamily: F.mono },

    adminGate: { maxWidth: 420, margin: "60px auto", background: COLOR.bgPanel, border: `1px solid ${COLOR.border}`, borderRadius: 14, padding: 32, textAlign: "center" },
    adminGateTitle: { fontSize: 19, fontWeight: 700, color: COLOR.text, marginBottom: 6 },
    adminGateSub: { fontSize: 13, color: COLOR.textMute, marginBottom: 20, lineHeight: 1.5 },
    adminGateInput: { width: "100%", background: COLOR.bgPanel2, border: `1px solid ${COLOR.border}`, borderRadius: 8, padding: "11px 14px", color: COLOR.text, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: F.mono },
    adminGateError: { color: COLOR.red, fontSize: 12, marginTop: 8, textAlign: "left" },
    adminGateBtn: { width: "100%", marginTop: 14, background: COLOR.amber, border: "none", color: "#1a1306", fontWeight: 700, fontSize: 13.5, borderRadius: 8, padding: "11px 0", cursor: "pointer" },
    adminGateNote: { marginTop: 18, fontSize: 11, color: COLOR.textFaint, lineHeight: 1.55, textAlign: "left" },

    adminPrimaryBtn: { background: COLOR.amber, border: "none", color: "#1a1306", fontWeight: 700, fontSize: 13, borderRadius: 8, padding: "10px 18px", cursor: "pointer", whiteSpace: "nowrap" },
    adminSecondaryBtn: { background: "transparent", border: `1px solid ${COLOR.border}`, color: COLOR.textFaint, fontWeight: 600, fontSize: 12.5, borderRadius: 8, padding: "10px 16px", cursor: "pointer", whiteSpace: "nowrap" },
    adminBackBtn: { background: "transparent", border: "none", color: COLOR.amber, fontWeight: 600, fontSize: 12.5, cursor: "pointer", padding: 0, marginBottom: 10, display: "inline-block" },
    adminHeaderActions: { display: "flex", gap: 8, flexShrink: 0 },
    adminEmptyState: { padding: "50px 20px", textAlign: "center", color: COLOR.textFaint, fontSize: 13.5, border: `1px dashed ${COLOR.border}`, borderRadius: 12, lineHeight: 1.6 },

    adminCaseList: { display: "flex", flexDirection: "column", gap: 8 },
    adminCaseRow: { display: "flex", alignItems: "center", justifyContent: "space-between", background: COLOR.bgPanel, border: `1px solid ${COLOR.border}`, borderRadius: 10, padding: "14px 18px", flexWrap: "wrap", gap: 10 },
    adminCaseName: { fontSize: 14, fontWeight: 600, color: COLOR.text },
    adminCaseMeta: { fontSize: 11.5, color: COLOR.textFaint, fontFamily: F.mono, marginTop: 4 },
    adminCaseActions: { display: "flex", gap: 8, flexShrink: 0 },
    adminCaseViewBtn: { background: "transparent", border: `1px solid ${COLOR.amber}55`, color: COLOR.amber, borderRadius: 7, padding: "7px 13px", fontSize: 12, cursor: "pointer" },
    adminCaseDeleteBtn: { background: "transparent", border: `1px solid ${COLOR.red}44`, color: COLOR.red, borderRadius: 7, padding: "7px 13px", fontSize: 12, cursor: "pointer" },

    adminForm: { display: "flex", flexDirection: "column", gap: 22, maxWidth: 880 },
    adminFormError: { background: "rgba(247,118,142,0.08)", border: `1px solid ${COLOR.red}44`, color: COLOR.red, borderRadius: 8, padding: "12px 16px", fontSize: 13 },
    adminFormSection: { background: COLOR.bgPanel, border: `1px solid ${COLOR.border}`, borderRadius: 12, padding: 20 },
    adminFormSectionTitle: { fontSize: 13.5, fontWeight: 700, color: COLOR.text, marginBottom: 4 },
    adminFormSectionSub: { fontSize: 12, color: COLOR.textFaint, marginBottom: 14, lineHeight: 1.5 },
    adminFormRow2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
    adminFormRow3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 },

    adminFieldWrap: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 },
    adminFieldLabel: { fontSize: 11, fontFamily: F.mono, color: COLOR.textFaint, textTransform: "uppercase", letterSpacing: "0.05em" },
    adminInput: { background: COLOR.bgPanel2, border: `1px solid ${COLOR.border}`, borderRadius: 7, padding: "10px 12px", color: COLOR.text, fontSize: 13, outline: "none", fontFamily: F.display },
    adminSelect: { background: COLOR.bgPanel2, border: `1px solid ${COLOR.border}`, borderRadius: 7, padding: "10px 12px", color: COLOR.text, fontSize: 13, outline: "none", fontFamily: F.display },
    adminTextarea: { background: COLOR.bgPanel2, border: `1px solid ${COLOR.border}`, borderRadius: 7, padding: "10px 12px", color: COLOR.text, fontSize: 13, outline: "none", fontFamily: F.display, resize: "vertical", lineHeight: 1.5 },

    adminImagingRow: { display: "grid", gridTemplateColumns: "220px 1fr 32px", gap: 8, marginBottom: 8, alignItems: "center" },
    adminImagingSeqInput: { background: COLOR.bgPanel2, border: `1px solid ${COLOR.border}`, borderRadius: 7, padding: "9px 11px", color: COLOR.text, fontSize: 12.5, outline: "none", fontFamily: F.mono },
    adminImagingValInput: { background: COLOR.bgPanel2, border: `1px solid ${COLOR.border}`, borderRadius: 7, padding: "9px 11px", color: COLOR.text, fontSize: 12.5, outline: "none", fontFamily: F.display },
    adminAddRowBtn: { background: "transparent", border: `1px dashed ${COLOR.border}`, color: COLOR.textMute, borderRadius: 7, padding: "8px 14px", fontSize: 12, cursor: "pointer", marginTop: 2 },
    adminRemoveRowBtn: { background: "transparent", border: "none", color: COLOR.textFaint, fontSize: 18, cursor: "pointer", lineHeight: 1, width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" },

    adminDropzoneRow: { display: "flex", gap: 12, flexWrap: "wrap" },
    adminDropzone: { flex: "1 1 220px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, border: `2px dashed ${COLOR.border}`, borderRadius: 10, padding: "28px 16px", cursor: "pointer", textAlign: "center" },
    adminDropzoneText: { fontSize: 13, color: COLOR.text, fontWeight: 600 },
    adminDropzoneHint: { fontSize: 11, color: COLOR.textFaint },
    adminFileList: { display: "flex", flexDirection: "column", gap: 6, marginTop: 12 },
    adminFileRow: { display: "flex", alignItems: "center", gap: 10, background: COLOR.bgPanel2, border: `1px solid ${COLOR.border}`, borderRadius: 8, padding: "8px 10px" },
    adminFileKindBadge: (kind) => ({
      fontSize: 9.5, fontFamily: F.mono, fontWeight: 700, padding: "3px 7px", borderRadius: 5, flexShrink: 0,
      color: kind === "dicom" ? COLOR.blue : kind === "video" ? COLOR.red : COLOR.green,
      background: kind === "dicom" ? "rgba(122,162,247,0.12)" : kind === "video" ? "rgba(247,118,142,0.12)" : "rgba(158,206,106,0.12)",
    }),
    adminFileName: { fontSize: 12, color: COLOR.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
    adminFileStudyInput: { background: COLOR.bgPanel, border: `1px solid ${COLOR.border}`, borderRadius: 6, padding: "6px 9px", color: COLOR.text, fontSize: 11.5, outline: "none", width: 220, fontFamily: F.display },

    adminFormActions: { display: "flex", justifyContent: "flex-end", gap: 10, paddingBottom: 30 },
    adminCancelBtn: { background: "transparent", border: `1px solid ${COLOR.border}`, color: COLOR.textMute, borderRadius: 8, padding: "11px 20px", fontSize: 13, cursor: "pointer" },
    adminSaveBtn: { background: COLOR.amber, border: "none", color: "#1a1306", fontWeight: 700, fontSize: 13, borderRadius: 8, padding: "11px 22px", cursor: "pointer" },
  };
  return S;
} //[cite: 2]

export let COLOR = THEMES.dark;
export let S = buildStyles(COLOR);
let rememberedTheme = null;
const ThemeContext = React.createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (rememberedTheme === "light" || rememberedTheme === "dark") return rememberedTheme;
    try {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
    } catch (e) {}
    return "dark";
  });

  COLOR = THEMES[theme];
  S = buildStyles(COLOR);

  useEffect(() => {
    rememberedTheme = theme;
    try { document.documentElement.style.colorScheme = theme; } catch (e) {}
  }, [theme]);

  function toggleTheme() {
    setTheme(t => (t === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
} //[cite: 2]
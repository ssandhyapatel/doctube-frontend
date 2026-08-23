import React from "react";
import { S } from "../styles/theme.jsx";

export function Breadcrumb({ crumbs, onClick }) {
  return (
    <div style={S.breadcrumb}>
      {crumbs.map((c, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ color: "#3a3f4a" }}>/</span>}
            {!isLast && onClick ? (
              <button onClick={() => onClick(i)} style={S.breadcrumbLink}>
                {c}
              </button>
            ) : (
              <span style={isLast ? S.breadcrumbCurrent : {}}>{c}</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function EmptyState({ text }) {
  return (
    <div style={S.pageWrap}>
      <div style={S.muted}>{text}</div>
    </div>
  );
}

export function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={S.sectionLabel}>{label}</div>
      <p style={S.sectionBody}>{children}</p>
    </div>
  );
}
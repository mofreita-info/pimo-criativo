// src/components/ui/ThemeSwitcher.tsx

import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { THEMES } from "../../theme/themes";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const activeTheme = THEMES.find((item) => item.id === theme);

  return (
    <div style={{ position: "relative" }}>
      {/* Button */}
      <div
        onClick={() => setOpen((v) => !v)}
        style={{
          padding: "6px 10px",
          fontSize: "14px",
          borderRadius: "var(--radius)",
          background: "var(--glass)",
          border: "1px solid var(--border)",
          cursor: "pointer",
          userSelect: "none",
          color: "var(--text-main)",
          minWidth: 140,
          textAlign: "left",
        }}
      >
        Tema: {activeTheme?.label ?? theme}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "38px",
            right: 0,
            background: "var(--panel-bg)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "6px 0",
            display: "flex",
            flexDirection: "column",
            minWidth: "140px",
            zIndex: "var(--z-popover)",
          }}
        >
          {THEMES.map((t) => (
            <div
              key={t.id}
              onClick={() => {
                setTheme(t.id);
                setOpen(false);
              }}
              style={{
                padding: "8px 12px",
                fontSize: "14px",
                cursor: "pointer",
                color:
                  theme === t.id
                    ? "var(--dot-blue)"
                    : "var(--text-main)",
                background:
                  theme === t.id
                    ? "rgba(255,255,255,0.05)"
                    : "transparent",
              }}
            >
              {t.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import Panel from "../ui/Panel";
import { MATERIAIS_INDUSTRIAIS, type MaterialIndustrial } from "../../core/manufacturing/materials";

const STORAGE_KEY = "pimo_admin_materials";

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "var(--text-main)",
  padding: "8px 10px",
  borderRadius: "var(--radius)",
  fontSize: 12,
};

const buttonStyle = {
  background: "rgba(59,130,246,0.2)",
  border: "1px solid rgba(59,130,246,0.4)",
  color: "var(--text-main)",
  padding: "8px 12px",
  borderRadius: "var(--radius)",
  fontSize: 12,
  cursor: "pointer",
};

export default function MaterialsManager() {
  const [materials, setMaterials] = useState<MaterialIndustrial[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as MaterialIndustrial[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // ignore storage errors
      }
    }
    return MATERIAIS_INDUSTRIAIS;
  });

  const [form, setForm] = useState<MaterialIndustrial>({
    nome: "",
    espessuraPadrao: 18,
    custo_m2: 0,
    cor: "",
  });

  const canSave = useMemo(
    () => form.nome.trim().length > 0 && form.espessuraPadrao > 0 && form.custo_m2 >= 0,
    [form]
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
  }, [materials]);

  const handleAdd = () => {
    setForm({ nome: "", espessuraPadrao: 18, custo_m2: 0, cor: "" });
  };

  const handleSave = () => {
    if (!canSave) return;
    const normalized: MaterialIndustrial = {
      nome: form.nome.trim(),
      espessuraPadrao: Math.max(0, Number(form.espessuraPadrao)),
      custo_m2: Math.max(0, Number(form.custo_m2)),
      cor: form.cor?.trim() || undefined,
    };
    setMaterials((prev) => [...prev, normalized]);
    setForm({ nome: "", espessuraPadrao: 18, custo_m2: 0, cor: "" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Panel title="Materiais existentes">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {materials.map((material) => (
            <div
              key={`${material.nome}-${material.espessuraPadrao}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "var(--radius)",
                padding: "8px 10px",
                fontSize: 12,
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{material.nome}</div>
                <div style={{ color: "var(--text-muted)" }}>
                  Espessura: {material.espessuraPadrao}mm · Custo: {material.custo_m2}€/m²
                </div>
              </div>
              {material.cor && (
                <div
                  title={material.cor}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: material.cor,
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Adicionar Material">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button style={buttonStyle} onClick={handleAdd}>
            Adicionar Material
          </button>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input
              style={inputStyle}
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => setForm((prev) => ({ ...prev, nome: e.target.value }))}
            />
            <input
              style={inputStyle}
              type="number"
              placeholder="Espessura padrão (mm)"
              value={form.espessuraPadrao}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, espessuraPadrao: Number(e.target.value) }))
              }
            />
            <input
              style={inputStyle}
              type="number"
              placeholder="Custo por m²"
              value={form.custo_m2}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, custo_m2: Number(e.target.value) }))
              }
            />
            <input
              style={inputStyle}
              placeholder="Cor (opcional)"
              value={form.cor ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, cor: e.target.value }))}
            />
          </div>
          <button
            style={{
              ...buttonStyle,
              background: canSave ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.08)",
              border: canSave ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(255,255,255,0.12)",
              cursor: canSave ? "pointer" : "not-allowed",
              opacity: canSave ? 1 : 0.6,
            }}
            onClick={handleSave}
            disabled={!canSave}
          >
            Guardar
          </button>
        </div>
      </Panel>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import Panel from "../ui/Panel";
import {
  listaInicialDeTemplates,
  salvarTemplate,
  type TemplateItem,
} from "../../core/templates/templates";

const STORAGE_KEY = "pimo_admin_templates";

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

const toTemplate = (form: TemplateItem): TemplateItem => ({
  id: form.id,
  nome: form.nome.trim(),
  categoria: form.categoria.trim(),
  descricao: form.descricao.trim(),
  dados: form.dados,
});

export default function TemplatesManager() {
  const [templates, setTemplates] = useState<TemplateItem[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as TemplateItem[];
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // ignore
      }
    }
    return listaInicialDeTemplates;
  });

  const [form, setForm] = useState<TemplateItem>({
    id: "",
    nome: "",
    categoria: "",
    descricao: "",
    dados: {},
  });

  const [dadosTexto, setDadosTexto] = useState("{}");
  const [importError, setImportError] = useState<string | null>(null);

  const canSave = useMemo(
    () =>
      form.nome.trim().length > 0 &&
      form.categoria.trim().length > 0 &&
      form.descricao.trim().length > 0 &&
      Object.keys(form.dados).length > 0,
    [form]
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  }, [templates]);

  const handleAdd = () => {
    setForm({ id: "", nome: "", categoria: "", descricao: "", dados: {} });
    setDadosTexto("{}");
    setImportError(null);
  };

  const handleSave = () => {
    if (!canSave) return;
    const id = form.id || `template-${Date.now()}`;
    const normalized = toTemplate({ ...form, id });
    const updated = salvarTemplate(normalized);
    setTemplates(updated);
    setForm({ id: "", nome: "", categoria: "", descricao: "", dados: {} });
    setDadosTexto("{}");
  };

  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const parsed = JSON.parse(text) as Record<string, unknown>;
        if (!parsed || typeof parsed !== "object") {
          throw new Error("JSON inválido");
        }
        setForm((prev) => ({ ...prev, dados: parsed }));
        setDadosTexto(JSON.stringify(parsed, null, 2));
        setImportError(null);
      } catch (error) {
        setImportError(error instanceof Error ? error.message : "Erro ao importar JSON");
      }
    };
    reader.readAsText(file);
  };

  const handleDadosChange = (value: string) => {
    setDadosTexto(value);
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object") {
        setForm((prev) => ({ ...prev, dados: parsed as Record<string, unknown> }));
        setImportError(null);
      }
    } catch {
      setImportError("JSON inválido");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Panel title="Templates existentes">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {templates.length === 0 ? (
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Nenhum template registado.
            </div>
          ) : (
            templates.map((template) => (
              <div
                key={template.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "var(--radius)",
                  padding: "8px 10px",
                  fontSize: 12,
                }}
              >
                <div style={{ fontWeight: 600 }}>{template.nome}</div>
                <div style={{ color: "var(--text-muted)" }}>
                  {template.categoria} · {template.descricao}
                </div>
              </div>
            ))
          )}
        </div>
      </Panel>

      <Panel title="Adicionar Template">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button style={buttonStyle} onClick={handleAdd}>
            Adicionar Template
          </button>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input
              style={inputStyle}
              placeholder="Nome do template"
              value={form.nome}
              onChange={(e) => setForm((prev) => ({ ...prev, nome: e.target.value }))}
            />
            <input
              style={inputStyle}
              placeholder="Categoria"
              value={form.categoria}
              onChange={(e) => setForm((prev) => ({ ...prev, categoria: e.target.value }))}
            />
            <input
              style={inputStyle}
              placeholder="Descrição curta"
              value={form.descricao}
              onChange={(e) => setForm((prev) => ({ ...prev, descricao: e.target.value }))}
            />
            <input
              style={inputStyle}
              placeholder="ID (opcional)"
              value={form.id}
              onChange={(e) => setForm((prev) => ({ ...prev, id: e.target.value }))}
            />
          </div>

          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
              Dados do template (JSON)
            </div>
            <textarea
              style={{
                ...inputStyle,
                minHeight: 120,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              }}
              value={dadosTexto}
              onChange={(e) => handleDadosChange(e.target.value)}
            />
            {importError && (
              <div style={{ fontSize: 11, color: "#f87171", marginTop: 6 }}>
                {importError}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <label style={{ ...buttonStyle, display: "inline-block" }}>
              Importar Template (JSON)
              <input
                type="file"
                accept="application/json"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImportJson(file);
                }}
              />
            </label>
            <button
              style={{
                ...buttonStyle,
                background: canSave ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.08)",
                border: canSave
                  ? "1px solid rgba(34,197,94,0.4)"
                  : "1px solid rgba(255,255,255,0.12)",
                cursor: canSave ? "pointer" : "not-allowed",
                opacity: canSave ? 1 : 0.6,
              }}
              onClick={handleSave}
              disabled={!canSave}
            >
              Guardar
            </button>
          </div>
        </div>
      </Panel>
    </div>
  );
}

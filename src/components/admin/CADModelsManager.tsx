import { useEffect, useMemo, useState } from "react";
import Panel from "../ui/Panel";
import ThreeViewer from "../three/ThreeViewer";
import {
  listaInicialDeModelos,
  salvarModelo,
  type CadModel,
} from "../../core/cad/cadModels";

const STORAGE_KEY = "pimo_admin_cad_models";

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

export default function CADModelsManager() {
  const [models, setModels] = useState<CadModel[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as CadModel[];
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // ignore
      }
    }
    return listaInicialDeModelos;
  });

  const [form, setForm] = useState<CadModel>({
    id: "",
    nome: "",
    categoria: "",
    descricao: "",
    arquivo: "",
  });
  const [arquivoNome, setArquivoNome] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const canSave = useMemo(
    () =>
      form.nome.trim().length > 0 &&
      form.categoria.trim().length > 0 &&
      form.descricao.trim().length > 0 &&
      form.arquivo.length > 0,
    [form]
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
  }, [models]);

  const handleAdd = () => {
    setForm({ id: "", nome: "", categoria: "", descricao: "", arquivo: "" });
    setArquivoNome("");
    setUploadError(null);
  };

  const handleSave = () => {
    if (!canSave) return;
    const id = form.id || `cad-${Date.now()}`;
    const normalized: CadModel = {
      id,
      nome: form.nome.trim(),
      categoria: form.categoria.trim(),
      descricao: form.descricao.trim(),
      arquivo: form.arquivo,
    };
    const updated = salvarModelo(normalized);
    setModels(updated);
    setForm({ id: "", nome: "", categoria: "", descricao: "", arquivo: "" });
    setArquivoNome("");
  };

  const handleUpload = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".glb")) {
      setUploadError("Apenas ficheiros .glb são permitidos.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const bytes = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i += 1) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = "data:model/gltf-binary;base64," + btoa(binary);
      setForm((prev) => ({ ...prev, arquivo: base64 }));
      setArquivoNome(file.name);
      setUploadError(null);
    };
    reader.onerror = () => {
      setUploadError("Falha ao ler o ficheiro.");
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Panel title="Modelos CAD existentes">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {models.length === 0 ? (
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Nenhum modelo registado.
            </div>
          ) : (
            models.map((model) => (
              <div
                key={model.id}
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
                <div style={{ fontWeight: 600 }}>{model.nome}</div>
                <div style={{ color: "var(--text-muted)" }}>
                  {model.categoria} · {model.descricao}
                </div>
                <div style={{ color: "var(--text-muted)" }}>
                  Ficheiro: {model.arquivo ? "carregado" : "pendente"}
                </div>
              </div>
            ))
          )}
        </div>
      </Panel>

      <Panel title="Adicionar Modelo 3D">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button style={buttonStyle} onClick={handleAdd}>
            Adicionar Modelo 3D
          </button>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input
              style={inputStyle}
              placeholder="Nome do modelo"
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
              placeholder="Descrição"
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
              Upload do ficheiro (.glb)
            </div>
            <label style={{ ...buttonStyle, display: "inline-block" }}>
              Escolher ficheiro
              <input
                type="file"
                accept=".glb"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                }}
              />
            </label>
            {arquivoNome && (
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
                Ficheiro: {arquivoNome}
              </div>
            )}
            {uploadError && (
              <div style={{ fontSize: 11, color: "#f87171", marginTop: 6 }}>
                {uploadError}
              </div>
            )}
          </div>

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
        {form.arquivo && (
          <div style={{ marginTop: 12 }}>
            <ThreeViewer
              modelUrl={form.arquivo}
              autoRotate={true}
              height={300}
              backgroundColor="#1e293b"
              showGrid={false}
              showFloor={false}
              colorize={true}
            />
          </div>
        )}
      </Panel>
    </div>
  );
}

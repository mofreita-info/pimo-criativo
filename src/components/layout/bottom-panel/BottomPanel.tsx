import { useMemo } from "react";
import { useProject } from "../../../context/useProject";
import Panel from "../../ui/Panel";
import CutlistPanel from "../../panels/CutlistPanel";
import {
  cutlistComPrecoFromBoxes,
  ferragensFromBoxes,
} from "../../../core/manufacturing/cutlistFromBoxes";
import {
  calcularPrecoTotalPecas,
  calcularPrecoTotalProjeto,
} from "../../../core/pricing/pricing";

export default function BottomPanel() {
  const { project } = useProject();
  const microTextStyle = { fontSize: 12, lineHeight: 1.4, color: "var(--text-muted)" };

  // Single Source of Truth: Resumo Financeiro 100% de project.boxes (não project.resultados/design)
  const boxes = project.boxes ?? [];
  const cutlist = useMemo(() => cutlistComPrecoFromBoxes(boxes), [boxes]);
  const ferragens = useMemo(() => ferragensFromBoxes(boxes), [boxes]);
  const totalPecas = cutlist.reduce((sum, item) => sum + item.quantidade, 0);
  const totalFerragens = ferragens.reduce((sum, a) => sum + a.quantidade, 0);
  const totalItens = totalPecas + totalFerragens;
  const custoPecas = cutlist.length > 0 ? calcularPrecoTotalPecas(cutlist) : null;
  const custoFerragens =
    ferragens.length > 0 ? ferragens.reduce((s, a) => s + a.precoTotal, 0) : null;
  const custoMateriais =
    custoPecas != null && custoFerragens != null
      ? custoPecas + custoFerragens
      : custoPecas ?? custoFerragens ?? null;
  const precoTotal =
    custoPecas != null && custoFerragens != null
      ? calcularPrecoTotalProjeto(custoPecas + custoFerragens)
      : null;
  const precoPorPeca =
    precoTotal != null && totalPecas > 0 ? precoTotal / totalPecas : null;
  const custoMontagem =
    precoTotal != null && custoPecas != null && custoFerragens != null
      ? precoTotal - (custoPecas + custoFerragens)
      : null;
  const precoPorCaixa =
    precoTotal != null && boxes.length > 0 ? precoTotal / boxes.length : null;

  return (
    <div className="bottom-panel-root">
      <CutlistPanel />

      <Panel title="Resumo Financeiro do Projeto">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-main)" }}>Quantidades</div>
          <div style={{ display: "flex", justifyContent: "space-between", ...microTextStyle }}>
            <span>Peças totais</span>
            <span style={{ color: "var(--text-main)" }}>{totalPecas}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", ...microTextStyle }}>
            <span>Ferragens totais</span>
            <span style={{ color: "var(--text-main)" }}>{totalFerragens}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", ...microTextStyle }}>
            <span>Total de itens</span>
            <span style={{ color: "var(--text-main)" }}>{totalItens}</span>
          </div>

          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.08)",
              margin: "6px 0",
            }}
          />

          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-main)" }}>Custos</div>
          <div style={{ display: "flex", justifyContent: "space-between", ...microTextStyle }}>
            <span>Materiais</span>
            <span style={{ color: "var(--text-main)" }}>
              {custoMateriais !== null ? `${custoMateriais.toFixed(2)} €` : "--"}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", ...microTextStyle }}>
            <span>Peças</span>
            <span style={{ color: "var(--text-main)" }}>
              {custoPecas !== null ? `${custoPecas.toFixed(2)} €` : "--"}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", ...microTextStyle }}>
            <span>Ferragens</span>
            <span style={{ color: "var(--text-main)" }}>
              {custoFerragens !== null ? `${custoFerragens.toFixed(2)} €` : "--"}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", ...microTextStyle }}>
            <span>Montagem</span>
            <span style={{ color: "var(--text-main)" }}>
              {custoMontagem !== null ? `${custoMontagem.toFixed(2)} €` : "--"}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
            <span style={{ color: "var(--text-main)" }}>Total geral</span>
            <span style={{ color: "var(--blue-light)" }}>
              {precoTotal !== null ? `${precoTotal.toFixed(2)} €` : "--"}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", ...microTextStyle }}>
            <span>Preço por peça</span>
            <span style={{ color: "var(--text-main)" }}>
              {precoPorPeca !== null ? `${precoPorPeca.toFixed(2)} €` : "--"}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", ...microTextStyle }}>
            <span>Preço por caixa</span>
            <span style={{ color: "var(--text-main)" }}>
              {precoPorCaixa !== null ? `${precoPorCaixa.toFixed(2)} €` : "--"}
            </span>
          </div>
        </div>
      </Panel>
    </div>
  );
}

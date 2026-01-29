import { useMemo } from "react";
import { useProject } from "../../context/useProject";
import { cutlistComPrecoFromBoxes } from "../../core/manufacturing/cutlistFromBoxes";

export default function CutListTable() {
  const { project } = useProject();
  const cutList = useMemo(
    () => cutlistComPrecoFromBoxes(project.boxes ?? []),
    [project.boxes]
  );

  if (!cutList || cutList.length === 0) {
    return <p>Nenhuma peça. Adicione caixas no painel direito.</p>;
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Lixeira de Cortes (Cut List)</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#eee" }}>
            <th>Peça</th>
            <th>Largura</th>
            <th>Altura</th>
            <th>Espessura</th>
            <th>Qtd</th>
            <th>Material</th>
            <th>Preço Unitário</th>
            <th>Preço Total</th>
          </tr>
        </thead>

        <tbody>
          {cutList.map((item) => (
            <tr key={item.id}>
              <td>{item.nome}</td>
              <td>{item.dimensoes.largura} mm</td>
              <td>{item.dimensoes.altura} mm</td>
              <td>{item.espessura} mm</td>
              <td>{item.quantidade}</td>
              <td>{item.material}</td>
              <td>{item.precoUnitario} €</td>
              <td>{item.precoTotal} €</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
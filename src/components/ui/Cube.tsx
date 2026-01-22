import "./cube.css";
import type { BoxLike } from "./cubeUtils";
import { updateCubePreview } from "./cubeUtils";

export function Cube({
  boxModule,
  offsetX = 0,
  rotationX = 0,
  rotationY = 0,
  colorIndex = 0,
  label,
  isDragging = false,
}: {
  boxModule?: BoxLike;
  offsetX?: number;
  rotationX?: number;
  rotationY?: number;
  colorIndex?: number;
  label?: string;
  isDragging?: boolean;
}) {
  const preview = updateCubePreview(boxModule, offsetX, undefined, colorIndex);
  const shelfLines = Array.from({ length: preview.shelves });
  const drawerLines = Array.from({ length: Math.max(0, preview.drawers - 1) });
  const doorLines =
    preview.doorType === "porta_dupla"
      ? [0.33, 0.66]
      : preview.doorType === "porta_simples"
      ? [0.5]
      : [];

  return (
    <div
      className="cube-container"
      style={{
        transform: `translateX(${preview.positionX}px) scale3d(${preview.scaleX}, ${preview.scaleY}, ${preview.scaleZ})`,
        transition: isDragging ? "none" : "transform 150ms ease-out",
        ["--cube-color" as string]: preview.color,
        ["--detail-color" as string]: preview.detailColor,
      }}
    >
      {label && <div className="cube-label">{label}</div>}
      <div className="cube-shadow" />
      <div
        className="cube"
        style={{ transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)` }}
      >
        <div className="face front">
          <div className="face-content">
            {shelfLines.map((_, index) => (
              <div
                key={`shelf-${index}`}
                className="line-h"
                style={{ top: `${((index + 1) / (preview.shelves + 1)) * 100}%` }}
              />
            ))}
            {drawerLines.map((_, index) => (
              <div
                key={`drawer-${index}`}
                className="line-h drawer"
                style={{ top: `${((index + 1) / preview.drawers) * 100}%` }}
              />
            ))}
            {doorLines.map((pos, index) => (
              <div key={`door-${index}`} className="line-v" style={{ left: `${pos * 100}%` }} />
            ))}
            {preview.doorType === "porta_correr" && (
              <>
                <div className="door-panel slide-a" />
                <div className="door-panel slide-b" />
              </>
            )}
          </div>
        </div>
        <div className="face back" />
        <div className="face left" />
        <div className="face right" />
        <div className="face top" />
        <div className="face bottom" />
      </div>
    </div>
  );
}
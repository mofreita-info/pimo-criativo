import type { BoxModule, WorkspaceBox } from "../../core/types";

export const CUBE_BASE_SIZE = 120;

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export type BoxLike = BoxModule | WorkspaceBox;

export type CubePreview = {
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  color: string;
  detailColor: string;
  shelves: number;
  drawers: number;
  doorType: BoxLike["portaTipo"];
  positionX: number;
  applyZoom?: (scaleFactor: number) => void;
};

const hexToHsl = (hex: string) => {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.substring(0, 2), 16) / 255;
  const g = parseInt(normalized.substring(2, 4), 16) / 255;
  const b = parseInt(normalized.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      default:
        h = (r - g) / delta + 4;
        break;
    }
    h /= 6;
  }

  return { h, s, l };
};

const hslToHex = (h: number, s: number, l: number) => {
  const hue2rgb = (p: number, q: number, t: number) => {
    let tValue = t;
    if (tValue < 0) tValue += 1;
    if (tValue > 1) tValue -= 1;
    if (tValue < 1 / 6) return p + (q - p) * 6 * tValue;
    if (tValue < 1 / 2) return q;
    if (tValue < 2 / 3) return p + (q - p) * (2 / 3 - tValue) * 6;
    return p;
  };

  let r = l;
  let g = l;
  let b = l;

  if (s !== 0) {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (value: number) => {
    const hex = Math.round(value * 255).toString(16).padStart(2, "0");
    return hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const shiftLightness = (hex: string, percentDelta: number) => {
  const { h, s, l } = hexToHsl(hex);
  const nextL = Math.min(1, Math.max(0, l + percentDelta / 100));
  return hslToHex(h, s, nextL);
};

export const updateCubePreview = (
  boxModule?: BoxLike,
  offsetX: number = 0,
  onZoom?: (scaleFactor: number) => void,
  colorIndex: number = 0
): CubePreview => {
  const largura = Number(boxModule?.dimensoes.largura ?? 1);
  const altura = Number(boxModule?.dimensoes.altura ?? 1);
  const profundidade = Number(boxModule?.dimensoes.profundidade ?? 1);
  const maxDim = Math.max(largura, altura, profundidade, 1);

  const scaleX = clamp((largura / maxDim) * 1.2, 0.45, 1.6);
  const scaleY = clamp((altura / maxDim) * 1.2, 0.45, 1.6);
  const scaleZ = clamp((profundidade / maxDim) * 1.2, 0.8, 1.6);

  const hasDrawers = (boxModule?.gavetas ?? 0) > 0;
  const doorType = boxModule?.portaTipo ?? "sem_porta";

  const colors: Record<BoxModule["portaTipo"], string> = {
    sem_porta: "#3b82f6",
    porta_simples: "#22c55e",
    porta_dupla: "#eab308",
    porta_correr: "#a855f7",
  };

  const detailColor = hasDrawers ? "#f97316" : colors[doorType];

  const baseColor = "#87CEEB";
  const colorShift = colorIndex === 0 ? 0 : (colorIndex % 2 === 1 ? 1 : -1) * colorIndex * 5;

  return {
    scaleX,
    scaleY,
    scaleZ,
    color: shiftLightness(baseColor, colorShift),
    detailColor,
    shelves: boxModule?.prateleiras ?? 0,
    drawers: boxModule?.gavetas ?? 0,
    doorType,
    positionX: offsetX,
    applyZoom: onZoom,
  };
};

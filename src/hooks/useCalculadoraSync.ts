import { useCallback, useEffect, useRef } from "react";
import type { BoxModule } from "../core/types";
import type { BoxOptions } from "../3d/objects/BoxBuilder";
import { mmToM } from "../utils/units";

type ViewerApi = {
  addBox: (id: string, options?: BoxOptions) => boolean;
  removeBox: (id: string) => boolean;
  updateBox: (id: string, options: Partial<BoxOptions>) => boolean;
  setBoxIndex: (id: string, index: number) => boolean;
  setBoxGap: (gap: number) => void;
};

type BoxState = { index: number };

export const useCalculadoraSync = (
  boxes: BoxModule[],
  viewerApi: ViewerApi,
  gap?: number,
  materialName?: string
) => {
  const boxesRef = useRef<BoxModule[]>(boxes);
  const viewerApiRef = useRef(viewerApi);
  const stateRef = useRef<Map<string, BoxState>>(new Map());

  useEffect(() => {
    viewerApiRef.current = viewerApi;
  }, [viewerApi]);

  useEffect(() => {
    boxesRef.current = boxes;
  }, [boxes]);

  const syncFromCalculator = useCallback(() => {
    const api = viewerApiRef.current;
    if (!api) return;
    const currentBoxes = boxesRef.current ?? [];
    const nextState = new Map<string, BoxState>();
    const currentIds = new Set<string>();

    currentBoxes.forEach((box, index) => {
      currentIds.add(box.id);
      nextState.set(box.id, { index });

      const widthMm = Number.isFinite(box.dimensoes?.largura) ? box.dimensoes.largura : undefined;
      const heightMm = Number.isFinite(box.dimensoes?.altura) ? box.dimensoes.altura : undefined;
      const depthMm = Number.isFinite(box.dimensoes?.profundidade)
        ? box.dimensoes.profundidade
        : undefined;
      const width = widthMm !== undefined ? mmToM(widthMm) : undefined;
      const height = heightMm !== undefined ? mmToM(heightMm) : undefined;
      const depth = depthMm !== undefined ? mmToM(depthMm) : undefined;
      const resolvedMaterialName = box.material ?? materialName ?? "mdf";

      if (!stateRef.current.has(box.id)) {
        api.addBox(box.id, { width, height, depth, materialName: resolvedMaterialName, index });
      } else {
        api.updateBox(box.id, { width, height, depth, materialName: resolvedMaterialName });
        const prevIndex = stateRef.current.get(box.id)?.index;
        if (prevIndex !== undefined && prevIndex !== index) {
          api.setBoxIndex(box.id, index);
        }
      }
    });

    Array.from(stateRef.current.keys()).forEach((id) => {
      if (!currentIds.has(id)) {
        api.removeBox(id);
      }
    });

    stateRef.current = nextState;
  }, [materialName]);

  useEffect(() => {
    syncFromCalculator();
  }, [boxes, syncFromCalculator]);

  useEffect(() => {
    const api = viewerApiRef.current;
    if (gap !== undefined && Number.isFinite(gap) && api) {
      api.setBoxGap(gap);
    }
  }, [gap]);

  return { syncFromCalculator };
};

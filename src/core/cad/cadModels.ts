export type CadModel = {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  arquivo: string;
};

const STORAGE_KEY = "pimo_admin_cad_models";

export const listaInicialDeModelos: CadModel[] = [];

export const getModelo = (id: string) => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as CadModel[];
      return parsed.find((item) => item.id === id);
    } catch {
      return undefined;
    }
  }
  return listaInicialDeModelos.find((item) => item.id === id);
};

export const salvarModelo = (modelo: CadModel) => {
  const stored = localStorage.getItem(STORAGE_KEY);
  let data = listaInicialDeModelos;
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as CadModel[];
      if (Array.isArray(parsed)) {
        data = parsed;
      }
    } catch {
      // fallback
    }
  }
  const next = [...data, modelo];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
};

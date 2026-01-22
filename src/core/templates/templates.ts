export type TemplateItem = {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  dados: Record<string, unknown>;
};

const STORAGE_KEY = "pimo_admin_templates";

export const listaInicialDeTemplates: TemplateItem[] = [];

export const getTemplate = (nome: string) => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as TemplateItem[];
      return parsed.find((item) => item.nome === nome);
    } catch {
      return undefined;
    }
  }
  return listaInicialDeTemplates.find((item) => item.nome === nome);
};

export const salvarTemplate = (template: TemplateItem) => {
  const stored = localStorage.getItem(STORAGE_KEY);
  let data = listaInicialDeTemplates;
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as TemplateItem[];
      if (Array.isArray(parsed)) {
        data = parsed;
      }
    } catch {
      // fallback
    }
  }
  const next = [...data, template];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
};

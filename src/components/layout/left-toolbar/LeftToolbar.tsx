type LeftToolbarItem = {
  id: string;
  label: string;
  icon: string;
  isHome?: boolean;
};

const toolbarItems: LeftToolbarItem[] = [
  { id: "home", label: "HOME", icon: "🏠", isHome: true },
  { id: "moveis", label: "Móveis", icon: "M" },
  { id: "caixa", label: "Caixa", icon: "C" },
  { id: "calculadora", label: "Calculadora", icon: "K" },
  { id: "layout", label: "Layout", icon: "L" },
  { id: "cores", label: "Cores", icon: "Co" },
  { id: "eletro", label: "Eletrodomésticos", icon: "E" },
  { id: "acessorios", label: "Acessórios", icon: "A" },
  { id: "thema", label: "Thema", icon: "T" },
  { id: "info", label: "Info", icon: "I" },
];

type LeftToolbarProps = {
  onSelect: () => void;
};

export default function LeftToolbar({ onSelect }: LeftToolbarProps) {
  const handleHomeClick = () => {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <aside className="left-toolbar" aria-label="Ferramentas rápidas">
      {toolbarItems.map((item) => {
        if (item.isHome) {
          return (
            <button 
              key={item.id} 
              type="button" 
              className="left-toolbar-item" 
              onClick={handleHomeClick}
              style={{ cursor: "pointer" }}
            >
              <span className="left-toolbar-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="left-toolbar-label">{item.label}</span>
            </button>
          );
        }
        
        return (
          <button key={item.id} type="button" className="left-toolbar-item" onClick={onSelect}>
            <span className="left-toolbar-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="left-toolbar-label">{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
}

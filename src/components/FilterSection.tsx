interface FilterSectionProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export default function FilterSection({ activeFilter, setActiveFilter }: FilterSectionProps) {
  const tabs = [
    { id: 'all', label: 'Todas' },
    { id: 'model-1', label: 'Modelo 01' },
    { id: 'model-2', label: 'Modelo 02' },
    { id: 'model-3', label: 'Modelo 03' },
  ];

  return (
    <section id="portfolio" className="py-20 px-6 md:px-16 text-center border-t border-surface-card bg-black-pure/40">
      <div className="text-[0.6rem] tracking-[0.35em] text-gold uppercase mb-4">
        Portfolio — 2026
      </div>
      <h2 className="font-serif text-3xl md:text-4xl font-light text-white-pure tracking-[0.06em] mb-8">
        Três Modelos. Universos Distintos.
      </h2>
      
      <div className="inline-flex border border-surface-card rounded-[2px] overflow-hidden">
        {tabs.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-5 py-3 md:px-8 text-[0.654rem] tracking-[0.2em] uppercase transition-all duration-300 ${
              activeFilter === tab.id
                ? 'bg-gold text-black-pure font-normal'
                : 'bg-transparent text-txt-muted hover:bg-gold/10 hover:text-gold'
            } ${idx < tabs.length - 1 ? 'border-r border-surface-card' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </section>
  );
}

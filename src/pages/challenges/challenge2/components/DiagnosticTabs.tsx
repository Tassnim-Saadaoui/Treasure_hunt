import { BatteryCharging, Gauge, PackageSearch, RadioTower } from 'lucide-react';
import { useId, useState } from 'react';
import { BatteryPanel } from './BatteryPanel';
import { CargoSpecsPanel } from './CargoSpecsPanel';
import { PropulsionPanel } from './PropulsionPanel';
import { SensorsPanel } from './SensorsPanel';

type DiagnosticTab = 'propulsion' | 'battery' | 'sensors' | 'cargo';

const TABS: Array<{ id: DiagnosticTab; label: string; icon: typeof Gauge }> = [
  { id: 'propulsion', label: 'Propulsion', icon: Gauge },
  { id: 'battery', label: 'Batterie', icon: BatteryCharging },
  { id: 'sensors', label: 'Capteurs', icon: RadioTower },
  { id: 'cargo', label: 'Fret & specs', icon: PackageSearch },
];

export function DiagnosticTabs() {
  const [activeTab, setActiveTab] = useState<DiagnosticTab>('propulsion');
  const idPrefix = useId();

  return (
    <section aria-labelledby={`${idPrefix}-title`} className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <h2 id={`${idPrefix}-title`} className="text-sm font-bold text-white sm:text-base">
          Diagnostic technique
        </h2>
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-cyan-300/80">
          Télémétrie live
        </span>
      </div>

      <div role="tablist" aria-label="Catégories du diagnostic" className="grid grid-cols-4 gap-1.5 rounded-2xl border border-white/10 bg-[#06132d] p-1.5">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              id={`${idPrefix}-tab-${id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${idPrefix}-panel`}
              onClick={() => setActiveTab(id)}
              className={`flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-[0.6rem] font-semibold transition sm:min-h-[54px] sm:flex-row sm:gap-1.5 sm:text-xs ${
                isActive
                  ? 'bg-[#087cf0] text-white shadow-[0_0_16px_rgba(0,124,240,0.3)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="leading-tight">{label}</span>
            </button>
          );
        })}
      </div>

      <div id={`${idPrefix}-panel`} aria-labelledby={`${idPrefix}-tab-${activeTab}`}>
        {activeTab === 'propulsion' && <PropulsionPanel />}
        {activeTab === 'battery' && <BatteryPanel />}
        {activeTab === 'sensors' && <SensorsPanel />}
        {activeTab === 'cargo' && <CargoSpecsPanel />}
      </div>
    </section>
  );
}

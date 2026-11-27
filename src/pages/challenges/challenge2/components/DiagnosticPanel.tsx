import type { ReactNode } from 'react';
import type { DiagnosticMetric as DiagnosticMetricData } from './droneDiagnosticData';
import { DiagnosticMetric } from './DiagnosticMetric';

interface DiagnosticPanelProps {
  title: string;
  description: string;
  icon: ReactNode;
  metrics: DiagnosticMetricData[];
}

export function DiagnosticPanel({ title, description, icon, metrics }: DiagnosticPanelProps) {
  return (
    <section
      role="tabpanel"
      className="rounded-2xl border border-[#168bff]/25 bg-[#0a1d43]/75 px-3.5 py-2.5 sm:px-4"
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-950/60 text-cyan-300">
          {icon}
        </span>
        <div>
          <h3 className="text-xs font-bold text-white sm:text-sm">{title}</h3>
          <p className="text-[0.62rem] text-slate-400">{description}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        {metrics.map((metric) => <DiagnosticMetric key={metric.label} metric={metric} />)}
      </div>
    </section>
  );
}

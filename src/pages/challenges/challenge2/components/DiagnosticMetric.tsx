import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type { DiagnosticMetric as DiagnosticMetricData } from './droneDiagnosticData';

interface DiagnosticMetricProps {
  metric: DiagnosticMetricData;
}

export function DiagnosticMetric({ metric }: DiagnosticMetricProps) {
  const needsInspection = metric.status === 'inspect';

  return (
    <div className="flex min-w-0 items-center justify-between gap-2 border-b border-white/[0.07] py-1.5 last:border-0">
      <p className="truncate text-[0.65rem] font-medium text-slate-400 sm:text-xs">{metric.label}</p>
      <div className="flex min-w-0 items-center gap-1.5">
        {metric.status && (
          needsInspection
            ? <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-300" aria-label="À inspecter" />
            : <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" aria-label="Normal" />
        )}
        <p className={`truncate text-[0.68rem] font-semibold sm:text-xs ${needsInspection ? 'text-amber-100' : 'text-white'}`}>
          {metric.value}
        </p>
      </div>
    </div>
  );
}

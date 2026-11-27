import { Gauge } from 'lucide-react';
import { DiagnosticPanel } from './DiagnosticPanel';
import { propulsionMetrics } from './droneDiagnosticData';

export function PropulsionPanel() {
  return (
    <DiagnosticPanel
      title="Propulsion"
      description="Moteurs et hélices"
      icon={<Gauge className="h-5 w-5" />}
      metrics={propulsionMetrics}
    />
  );
}

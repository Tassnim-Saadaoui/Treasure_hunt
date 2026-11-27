import { BatteryCharging } from 'lucide-react';
import { DiagnosticPanel } from './DiagnosticPanel';
import { batteryMetrics } from './droneDiagnosticData';

export function BatteryPanel() {
  return (
    <DiagnosticPanel
      title="Batterie"
      description="Alimentation du drone"
      icon={<BatteryCharging className="h-5 w-5" />}
      metrics={batteryMetrics}
    />
  );
}

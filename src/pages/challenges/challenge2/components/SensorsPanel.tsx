import { RadioTower } from 'lucide-react';
import { DiagnosticPanel } from './DiagnosticPanel';
import { sensorMetrics } from './droneDiagnosticData';

export function SensorsPanel() {
  return (
    <DiagnosticPanel
      title="Capteurs"
      description="Navigation et stabilisation"
      icon={<RadioTower className="h-5 w-5" />}
      metrics={sensorMetrics}
    />
  );
}

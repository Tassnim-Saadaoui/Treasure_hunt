import { PackageSearch } from 'lucide-react';
import { DiagnosticPanel } from './DiagnosticPanel';
import { cargoMetrics } from './droneDiagnosticData';

export function CargoSpecsPanel() {
  return (
    <DiagnosticPanel
      title="Fret & specs"
      description="Charge transportée"
      icon={<PackageSearch className="h-5 w-5" />}
      metrics={cargoMetrics}
    />
  );
}

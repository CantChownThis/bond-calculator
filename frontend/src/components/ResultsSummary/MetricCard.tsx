interface MetricCardProps {
  label: string;
  value: string;
  description: string;
  accent?: 'green' | 'red' | 'neutral';
}

export function MetricCard({ label, value, description, accent }: MetricCardProps) {
  const accentClass =
    accent === 'green'
      ? 'text-success'
      : accent === 'red'
        ? 'text-error'
        : '';

  return (
    <div className="card bg-base-200 shadow-sm">
      <div className="card-body p-5">
        <p className="text-sm font-medium text-base-content/60 uppercase tracking-wide">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${accentClass}`}>{value}</p>
        <p className="text-xs text-base-content/50 mt-1">{description}</p>
      </div>
    </div>
  );
}

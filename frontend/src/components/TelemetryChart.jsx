export default function TelemetryChart({ data }) {
    return (
      <div className="h-64 grid place-items-center rounded-2xl border border-white/10 bg-slate-900 text-slate-400">
        {Array.isArray(data) && data.length
          ? "Chart placeholder (hook up Recharts/Chart.js later)"
          : "Chart placeholder"}
      </div>
    );
  }
  
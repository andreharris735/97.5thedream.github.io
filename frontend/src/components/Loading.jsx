export default function Loading({ label = "Loading..." }) {
    return <div className="animate-pulse text-sm text-slate-400">{label}</div>;
  }
  
export default function MapView({ track }) {
    return (
      <div className="h-72 grid place-items-center rounded-2xl border border-white/10 bg-slate-900 text-slate-400">
        {Array.isArray(track) && track.length
          ? "Map placeholder (hook up Leaflet/Mapbox later)"
          : "Map placeholder"}
      </div>
    );
  }
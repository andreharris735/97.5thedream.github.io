export default function FlightResults({ data }) {
    if (!data) return null;
  
    const { ident, origin, destination, altitude_ft, groundspeed_kt } = data;
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900 p-4">
        <div className="text-lg font-semibold">{ident}</div>
        <div className="text-slate-300 text-sm">{origin} → {destination}</div>
        <div className="text-sm mt-1">
          Alt: {altitude_ft ?? "—"} ft · GS: {groundspeed_kt ?? "—"} kt
        </div>
      </div>
    );
  }
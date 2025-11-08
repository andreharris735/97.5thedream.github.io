import { useState } from "react";
import FlightSearch from "../components/FlightSearch";
import FlightResults from "../components/FlightResults";
import MapView from "../components/MapView";
import TelemetryChart from "../components/TelemetryChart";
import Loading from "../components/loading";
import ErrorBanner from "../components/ErrorBanner";

export default function Dashboard() {
  const [flight, setFlight] = useState(null);
  const [track, setTrack] = useState([]);
  const [telemetry, setTelemetry] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSearch(ident) {
    setErr("");
    setLoading(true);
    setFlight(null);
    setTrack([]);
    setTelemetry([]);
    try {
      // Adjust to match your FastAPI route & response shape
      const res = await fetch(`/api/flights/${encodeURIComponent(ident)}`);
      if (!res.ok) throw new Error(`API ${res.status}`);
      const json = await res.json();
      setFlight(json);
      setTrack(json.track || []);
      setTelemetry(json.telemetry || []);
    } catch (e) {
      setErr(e.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <section className="rounded-2xl border border-white/10 bg-slate-950 p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-300">Search</h2>
        <FlightSearch onSearch={handleSearch} />
        {loading && <div className="mt-3"><Loading label="Fetching flight data..." /></div>}
        {err && <div className="mt-3"><ErrorBanner msg={err} /></div>}
      </section>

      {/* Summary + Live placeholder */}
      <section className="grid gap-4 md:grid-cols-2">
        <FlightResults data={flight} />
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-4 text-slate-300">
          <div className="text-lg font-semibold mb-2">Live status</div>
          <div className="text-sm">WebSocket placeholder — connect to <code>/ws/flight/:ident</code> later.</div>
        </div>
      </section>

      {/* Map */}
      <MapView track={track} />

      {/* Chart */}
      <TelemetryChart data={telemetry} />
    </div>
  );
}
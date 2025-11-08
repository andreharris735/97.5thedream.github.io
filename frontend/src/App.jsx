import { useEffect, useState } from "react";
import "./index.css";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { getToken, clearToken } from "./lib/auth";

export default function App() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(Boolean(getToken()));
  }, []);

  function handleLogout() {
    clearToken();
    setAuthed(false);
  }

  return authed ? (
    <div className="min-h-screen bg-slate-950 text-white">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex justify-end mb-4">
          <button
            className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <Dashboard />
      </main>
    </div>
  ) : (
    <Login onSuccess={() => setAuthed(true)} />
  );
}

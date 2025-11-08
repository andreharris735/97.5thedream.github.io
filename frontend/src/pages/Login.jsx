import { useState } from "react";
import { loginRequest, saveToken } from "../lib/auth";

export default function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!email.trim() || !pw.trim()) {
      setErr("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const data = await loginRequest({ email, password: pw });
      saveToken(data.token);           // store JWT
      onSuccess?.(data);               // tell App "we're logged in"
    } catch (e) {
      setErr(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white grid place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur p-6 shadow-xl">
        <h1 className="text-3xl font-extrabold text-center mb-6 tracking-wide">97.5 THE DREAM ✈️</h1>

        {err && <div className="mb-4 rounded-lg border border-red-400 bg-red-950/30 text-red-300 px-3 py-2 text-sm">{err}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                className="w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2 pr-12 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm"
                onClick={() => setShowPw((s) => !s)}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 font-semibold"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

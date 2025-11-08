export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-white/10 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col items-center text-center">
        {/* Main Title */}
        <h1 className="text-3xl font-extrabold text-white tracking-wide font-mono">
          97.5 THE DREAM ✈️
        </h1>

        {/* Navigation Buttons */}
        <nav className="mt-3 flex flex-wrap justify-center gap-6 text-lg font-medium text-slate-300">
          <a href="#" className="hover:text-blue-400 transition-colors">Detect</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Inject</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Protect</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Reflect</a>
        </nav>
      </div>
    </header>
  );
}
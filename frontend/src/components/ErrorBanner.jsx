export default function ErrorBanner({ msg }) {
    if (!msg) return null;
    return (
      <div className="p-3 bg-red-100 text-red-700 rounded border border-red-200">
        {msg}
      </div>
    );
  }
  
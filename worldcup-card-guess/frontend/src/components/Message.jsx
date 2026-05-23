export default function Message({ type = "info", children }) {
  if (!children) return null;
  const tone = type === "error"
    ? "border-rose-200 bg-rose-50 text-rose-700"
    : "border-emerald-200 bg-emerald-50 text-emerald-700";
  return <div className={`rounded-md border px-4 py-3 text-sm ${tone}`}>{children}</div>;
}

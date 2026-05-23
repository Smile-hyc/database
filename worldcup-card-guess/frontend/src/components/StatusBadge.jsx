const toneMap = {
  upcoming: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  finished: "bg-slate-100 text-slate-700 ring-slate-200",
  canceled: "bg-rose-50 text-rose-700 ring-rose-200",
  rising: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  falling: "bg-rose-50 text-rose-700 ring-rose-200",
  normal: "bg-blue-50 text-blue-700 ring-blue-200"
};

export default function StatusBadge({ value }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${toneMap[value] || toneMap.normal}`}>
      {value}
    </span>
  );
}

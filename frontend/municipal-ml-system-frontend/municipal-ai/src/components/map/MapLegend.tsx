// src/components/map/MapLegend.tsx

export default function MapLegend() {
  const items = [
    { color: "#EF4444", label: "High Priority / Hospital", symbol: "⚠/🏥" },
    { color: "#F97316", label: "Medium Priority", symbol: "⚠" },
    { color: "#22C55E", label: "Low Priority", symbol: "⚠" },
    { color: "#3B82F6", label: "School", symbol: "🏫" },
  ];

  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-ink-900/90 backdrop-blur border border-ink-600 rounded-xl p-3 text-xs space-y-2">
      <div className="font-mono uppercase tracking-wider text-slate-500 text-[10px] mb-2">
        Legend
      </div>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ background: item.color }}
          />
          <span className="text-slate-400 font-body">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

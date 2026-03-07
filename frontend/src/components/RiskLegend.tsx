"use client";

interface RiskLegendProps {
  visible: boolean;
  onToggle: () => void;
}

export default function RiskLegend({ visible, onToggle }: RiskLegendProps) {
  return (
    <div className="absolute top-4 right-4 z-20">
      <button
        onClick={onToggle}
        className={`px-3 py-2 rounded-xl text-xs font-medium border shadow-lg backdrop-blur-md transition-colors ${
          visible
            ? "bg-white/15 border-white/30 text-white"
            : "bg-gray-900/90 border-white/10 text-white/60 hover:text-white"
        }`}
      >
        {visible ? "Hide" : "Show"} Risk Heatmap
      </button>

      {visible && (
        <div className="mt-2 bg-gray-900/95 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-3 w-48">
          <h3 className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
            Risk Level
          </h3>
          <div className="space-y-1.5">
            {[
              { color: "bg-green-500", label: "Low Risk" },
              { color: "bg-yellow-500", label: "Medium Risk" },
              { color: "bg-red-500", label: "Higher Risk" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span
                  className={`w-4 h-2.5 rounded-sm ${item.color}`}
                />
                <span className="text-xs text-white/60">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
            ? "bg-blue-50 border-blue-200 text-blue-600"
            : "bg-white/90 border-gray-200 text-gray-500 hover:text-gray-700"
        }`}
      >
        {visible ? "Hide" : "Show"} Risk Heatmap
      </button>

      {visible && (
        <div className="mt-2 bg-white/95 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg p-3 w-48">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Risk Level
          </h3>
          <div className="space-y-1.5">
            {[
              { color: "bg-green-500", label: "Low Risk" },
              { color: "bg-yellow-500", label: "Medium Risk" },
              { color: "bg-red-500", label: "Higher Risk" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className={`w-4 h-2.5 rounded-sm ${item.color}`} />
                <span className="text-xs text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

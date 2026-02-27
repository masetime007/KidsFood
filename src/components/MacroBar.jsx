/**
 * Visual macro breakdown bar.
 * Shows carbs / protein / fat as a percentage strip with colour coding.
 */
export default function MacroBar({ macros, showTargets = false }) {
  const carbCals = macros.carbsG * 4;
  const proteinCals = macros.proteinG * 4;
  const fatCals = macros.fatG * 9;
  const total = carbCals + proteinCals + fatCals;

  const carbPct = Math.round((carbCals / total) * 100);
  const proteinPct = Math.round((proteinCals / total) * 100);
  const fatPct = 100 - carbPct - proteinPct;

  // Targets: Carbs 45-65%, Protein 10-30%, Fat 25-35%
  const inRange = (val, min, max) => val >= min && val <= max;
  const carbOk = inRange(carbPct, 45, 65);
  const proteinOk = inRange(proteinPct, 10, 30);
  const fatOk = inRange(fatPct, 25, 35);

  return (
    <div className="space-y-1">
      {/* Bar */}
      <div className="flex rounded-full overflow-hidden h-4">
        <div
          className="bg-amber-400 transition-all"
          style={{ width: `${carbPct}%` }}
          title={`Carbs ${carbPct}%`}
        />
        <div
          className="bg-rose-400 transition-all"
          style={{ width: `${proteinPct}%` }}
          title={`Protein ${proteinPct}%`}
        />
        <div
          className="bg-blue-400 transition-all"
          style={{ width: `${fatPct}%` }}
          title={`Fat ${fatPct}%`}
        />
      </div>

      {/* Legend */}
      <div className="flex gap-3 text-xs text-gray-600 flex-wrap">
        <span className={`flex items-center gap-1 ${showTargets && !carbOk ? "text-red-500 font-semibold" : ""}`}>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400" />
          Carbs {carbPct}% {showTargets && <span className="text-gray-400">(45–65%)</span>}
        </span>
        <span className={`flex items-center gap-1 ${showTargets && !proteinOk ? "text-red-500 font-semibold" : ""}`}>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-400" />
          Protein {proteinPct}% {showTargets && <span className="text-gray-400">(10–30%)</span>}
        </span>
        <span className={`flex items-center gap-1 ${showTargets && !fatOk ? "text-red-500 font-semibold" : ""}`}>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-400" />
          Fat {fatPct}% {showTargets && <span className="text-gray-400">(25–35%)</span>}
        </span>
        <span className="ml-auto font-medium text-gray-700">
          {macros.calories} kcal
        </span>
      </div>
    </div>
  );
}

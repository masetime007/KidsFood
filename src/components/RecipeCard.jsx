import { useState } from "react";
import MacroBar from "./MacroBar";

const CATEGORY_COLORS = {
  "Pasta & Rice": "bg-amber-100 text-amber-700",
  "Chicken & Meat": "bg-rose-100 text-rose-700",
  Fish: "bg-blue-100 text-blue-700",
  Vegetarian: "bg-green-100 text-green-700",
};

export default function RecipeCard({ recipe, compact = false, onSelect, selected = false }) {
  const [expanded, setExpanded] = useState(false);

  const catColor = CATEGORY_COLORS[recipe.category] || "bg-gray-100 text-gray-700";

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border-2 transition-all ${
        selected ? "border-orange-400 shadow-orange-100 shadow-md" : "border-transparent hover:border-orange-200"
      }`}
    >
      {/* Card header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-3xl" role="img" aria-label={recipe.name}>
              {recipe.emoji}
            </span>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-800 text-sm leading-snug">{recipe.name}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColor}`}>
                  {recipe.category}
                </span>
                <span className="text-xs text-gray-400">
                  ⏱ {recipe.prepTime + recipe.cookTime} min
                </span>
                <span className="text-xs text-yellow-500">
                  {"⭐".repeat(recipe.kidFriendlyRating)}
                </span>
              </div>
            </div>
          </div>

          {onSelect && (
            <button
              onClick={() => onSelect(recipe)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                selected
                  ? "bg-orange-400 text-white"
                  : "bg-orange-50 text-orange-500 hover:bg-orange-100"
              }`}
            >
              {selected ? "✓ Selected" : "Pick"}
            </button>
          )}
        </div>

        {!compact && (
          <p className="mt-2 text-xs text-gray-500 leading-relaxed">{recipe.description}</p>
        )}

        {/* Hidden veg badges */}
        {recipe.hiddenVeg.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {recipe.hiddenVeg.map((veg) => (
              <span
                key={veg}
                className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full"
                title="Hidden vegetable — kids won't notice!"
              >
                🥷 hidden: {veg}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Macro bar */}
      <div className="px-4 pb-3">
        <MacroBar macros={recipe.macros} />
      </div>

      {/* Expand toggle */}
      {!compact && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full text-xs text-orange-500 hover:text-orange-600 font-medium py-2 border-t border-gray-100 transition-colors"
          >
            {expanded ? "▲ Hide details" : "▼ Show recipe"}
          </button>

          {expanded && (
            <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
              {/* Ingredients */}
              <div>
                <h4 className="font-semibold text-gray-700 text-sm mt-3 mb-2">
                  🛒 Ingredients <span className="text-gray-400 font-normal">(serves {recipe.servings})</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex justify-between text-xs text-gray-600 bg-gray-50 rounded px-2 py-1">
                      <span>{ing.item}</span>
                      <span className="text-gray-400 ml-2">{ing.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Method */}
              <div>
                <h4 className="font-semibold text-gray-700 text-sm mb-2">👨‍🍳 Method</h4>
                <ol className="space-y-1.5">
                  {recipe.method.map((step, i) => (
                    <li key={i} className="flex gap-2 text-xs text-gray-600">
                      <span className="shrink-0 w-5 h-5 bg-orange-400 text-white rounded-full flex items-center justify-center font-bold text-[10px]">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Science note */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                <p className="text-xs text-blue-700 leading-relaxed">
                  <span className="font-semibold">🔬 Nutrition note: </span>
                  {recipe.scienceNote}
                </p>
              </div>

              {/* Serving suggestion */}
              {recipe.servingSuggestion && (
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
                  <p className="text-xs text-orange-700">
                    <span className="font-semibold">💡 Serving tip: </span>
                    {recipe.servingSuggestion}
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

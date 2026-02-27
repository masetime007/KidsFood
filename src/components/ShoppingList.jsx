import { useState } from "react";
import { buildShoppingList } from "../utils/shoppingList";
import { DAYS_OF_WEEK } from "../data/recipes";

export default function ShoppingList({ mealPlan }) {
  const [checked, setChecked] = useState({});

  if (!mealPlan || mealPlan.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 text-center py-20">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-lg font-bold text-gray-700 mb-2">No plan yet!</h2>
        <p className="text-sm text-gray-500">
          Generate a meal plan first, then your shopping list will appear here.
        </p>
      </div>
    );
  }

  const grouped = buildShoppingList(mealPlan);
  const totalItems = Object.values(grouped).flat().length;
  const checkedCount = Object.values(checked).filter(Boolean).length;

  function toggleItem(key) {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function clearChecked() {
    setChecked({});
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Shopping List</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {checkedCount}/{totalItems} items ticked
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          {checkedCount > 0 && (
            <button
              onClick={clearChecked}
              className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
            >
              Reset
            </button>
          )}
          <button
            onClick={handlePrint}
            className="text-xs px-3 py-1.5 bg-orange-400 hover:bg-orange-500 text-white rounded-lg transition-colors font-semibold"
          >
            🖨 Print
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-300"
          style={{ width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%` }}
        />
      </div>

      {/* Meal plan summary */}
      <div className="bg-orange-50 rounded-2xl p-4">
        <h3 className="text-sm font-bold text-orange-700 mb-2">This week&apos;s meals</h3>
        <div className="grid grid-cols-2 gap-1">
          {mealPlan.map((recipe, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="text-gray-400 w-16 shrink-0">{DAYS_OF_WEEK[i]}:</span>
              <span>{recipe.emoji} {recipe.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grouped list */}
      <div className="space-y-4">
        {Object.entries(grouped).map(([aisle, items]) => (
          <div key={aisle} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <h3 className="font-bold text-gray-700 text-sm">{aisle}</h3>
              <p className="text-xs text-gray-400">{items.length} item{items.length !== 1 ? "s" : ""}</p>
            </div>
            <ul className="divide-y divide-gray-50">
              {items.map((item, idx) => {
                const key = `${aisle}-${idx}`;
                const isChecked = checked[key];
                return (
                  <li
                    key={key}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                      isChecked ? "bg-green-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => toggleItem(key)}
                  >
                    <div
                      className={`shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isChecked
                          ? "bg-green-400 border-green-400 text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {isChecked && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <span
                          className={`text-sm font-medium ${
                            isChecked ? "line-through text-gray-400" : "text-gray-700"
                          }`}
                        >
                          {item.item}
                        </span>
                        <span className="text-xs text-gray-400 shrink-0">{item.amount}</span>
                      </div>
                      {item.recipes.length > 0 && (
                        <div className="mt-0.5 flex flex-wrap gap-1">
                          {item.recipes.map((r) => (
                            <span key={r.name} className="text-xs text-gray-400">
                              {r.emoji} {r.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Done message */}
      {checkedCount === totalItems && totalItems > 0 && (
        <div className="text-center py-6 bg-green-50 rounded-2xl border-2 border-green-200">
          <div className="text-4xl mb-2">🎉</div>
          <p className="font-bold text-green-700">All done! Happy cooking!</p>
        </div>
      )}
    </div>
  );
}

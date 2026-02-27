import { useState } from "react";
import { DAYS_OF_WEEK, recipes as allRecipes } from "../data/recipes";
import { generateWeekPlan, computeWeeklyNutrition, checkMacroTargets } from "../utils/planner";
import RecipeCard from "./RecipeCard";
import MacroBar from "./MacroBar";

export default function WeekPlanner({ mealPlan, onPlanChange, onGoShopping }) {
  const [swapDay, setSwapDay] = useState(null); // index of day being swapped

  function handleGenerate() {
    onPlanChange(generateWeekPlan());
    setSwapDay(null);
  }

  function handleSwapRecipe(dayIndex, recipe) {
    const newPlan = [...mealPlan];
    newPlan[dayIndex] = recipe;
    onPlanChange(newPlan);
    setSwapDay(null);
  }

  const nutrition = mealPlan.length > 0 ? computeWeeklyNutrition(mealPlan) : null;
  const targets = nutrition ? checkMacroTargets(nutrition) : null;
  const allGood = targets && targets.carbs && targets.protein && targets.fat;

  // Recipes not currently in plan (for swap picker)
  const usedIds = new Set(mealPlan.map((r) => r.id));
  const availableForSwap = allRecipes.filter((r) => !usedIds.has(r.id));

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800">This Week&apos;s Dinners</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            7 balanced meals • macro-optimised • kid-approved
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-sm text-sm"
          >
            {mealPlan.length === 0 ? "✨ Generate Plan" : "🔄 Regenerate"}
          </button>
          {mealPlan.length > 0 && (
            <button
              onClick={onGoShopping}
              className="px-5 py-2.5 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors shadow-sm text-sm"
            >
              🛒 Shopping List
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {mealPlan.length === 0 && (
        <div className="text-center py-20 bg-orange-50 rounded-2xl border-2 border-dashed border-orange-200">
          <div className="text-6xl mb-4">🍽</div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">Ready to plan your week?</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
            Click &quot;Generate Plan&quot; to get 7 balanced, kid-friendly dinners with hidden vegetables and
            scientifically optimised macros.
          </p>
          <button
            onClick={handleGenerate}
            className="px-8 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 shadow-md text-sm"
          >
            ✨ Generate My Meal Plan
          </button>
        </div>
      )}

      {/* Weekly nutrition summary */}
      {nutrition && (
        <div className={`rounded-2xl p-4 border-2 ${allGood ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{allGood ? "✅" : "⚠️"}</span>
            <div>
              <h3 className="font-bold text-gray-700 text-sm">Weekly Nutrition Summary</h3>
              <p className="text-xs text-gray-500">
                Average per dinner • Based on USDA Dietary Guidelines for children 4–12
              </p>
            </div>
          </div>
          <MacroBar
            macros={{
              calories: nutrition.avgCalories,
              carbsG: Math.round(nutrition.totals.carbsG / 7),
              proteinG: Math.round(nutrition.totals.proteinG / 7),
              fatG: Math.round(nutrition.totals.fatG / 7),
            }}
            showTargets
          />
          {!allGood && (
            <p className="text-xs text-amber-700 mt-2">
              Some macros are slightly outside ideal ranges — try regenerating or swapping individual meals.
            </p>
          )}
        </div>
      )}

      {/* Day-by-day plan */}
      {mealPlan.length > 0 && (
        <div className="space-y-3">
          {mealPlan.map((recipe, i) => (
            <div key={`${recipe.id}-${i}`} className="flex gap-3 items-start">
              {/* Day label */}
              <div className="w-20 shrink-0 pt-4 text-center">
                <div className="font-bold text-gray-700 text-sm">{DAYS_OF_WEEK[i]}</div>
              </div>

              {/* Recipe card */}
              <div className="flex-1 min-w-0">
                <RecipeCard recipe={recipe} />
              </div>

              {/* Swap button */}
              <div className="shrink-0 pt-4">
                <button
                  onClick={() => setSwapDay(swapDay === i ? null : i)}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                  title="Swap this meal"
                >
                  🔄
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Swap picker modal */}
      {swapDay !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white px-4 py-3 border-b flex items-center justify-between">
              <h3 className="font-bold text-gray-800">
                Swap {DAYS_OF_WEEK[swapDay]}&apos;s meal
              </h3>
              <button
                onClick={() => setSwapDay(null)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-3">
              {availableForSwap.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  compact
                  onSelect={(r) => handleSwapRecipe(swapDay, r)}
                />
              ))}
              {availableForSwap.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">
                  All recipes are already in your plan! Generate a new plan for more options.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

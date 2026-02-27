import { recipes } from "../data/recipes";

/**
 * Generates a balanced weekly meal plan.
 *
 * Rules:
 *  - 7 dinners (one per day)
 *  - No recipe repeated
 *  - At least one fish meal per week (NHS/WHO recommendation)
 *  - At least two vegetarian meals per week
 *  - Average macros across the week should sit within USDA ranges:
 *      Carbs 45–65%, Protein 10–30%, Fat 25–35%
 */
export function generateWeekPlan() {
  const pool = [...recipes];
  const plan = [];

  // Ensure we always include at least one fish and two vegetarian
  const fishOptions = pool.filter((r) => r.category === "Fish");
  const vegOptions = pool.filter((r) => r.category === "Vegetarian");
  const otherOptions = pool.filter((r) => r.category !== "Fish" && r.category !== "Vegetarian");

  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

  const chosenFish = shuffle(fishOptions).slice(0, 1);
  const chosenVeg = shuffle(vegOptions).slice(0, 2);
  const remaining = shuffle(otherOptions).slice(0, 4);

  const combined = shuffle([...chosenFish, ...chosenVeg, ...remaining]);

  // Assign to days
  return combined.slice(0, 7).map((recipe) => recipe);
}

/**
 * Computes aggregate nutrition for a meal plan.
 */
export function computeWeeklyNutrition(mealPlan) {
  const totals = mealPlan.reduce(
    (acc, recipe) => ({
      calories: acc.calories + recipe.macros.calories,
      carbsG: acc.carbsG + recipe.macros.carbsG,
      proteinG: acc.proteinG + recipe.macros.proteinG,
      fatG: acc.fatG + recipe.macros.fatG,
    }),
    { calories: 0, carbsG: 0, proteinG: 0, fatG: 0 }
  );

  const avgCalories = totals.calories / mealPlan.length;
  const carbCals = totals.carbsG * 4;
  const proteinCals = totals.proteinG * 4;
  const fatCals = totals.fatG * 9;
  const totalMacroCals = carbCals + proteinCals + fatCals;

  return {
    avgCalories: Math.round(avgCalories),
    carbsPct: Math.round((carbCals / totalMacroCals) * 100),
    proteinPct: Math.round((proteinCals / totalMacroCals) * 100),
    fatPct: Math.round((fatCals / totalMacroCals) * 100),
    totals,
  };
}

/**
 * Checks if weekly macros fall within recommended ranges.
 */
export function checkMacroTargets(nutrition) {
  return {
    carbs: nutrition.carbsPct >= 45 && nutrition.carbsPct <= 65,
    protein: nutrition.proteinPct >= 10 && nutrition.proteinPct <= 30,
    fat: nutrition.fatPct >= 25 && nutrition.fatPct <= 35,
  };
}

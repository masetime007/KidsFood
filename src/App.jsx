import { useState } from "react";
import Header from "./components/Header";
import WeekPlanner from "./components/WeekPlanner";
import RecipeBrowser from "./components/RecipeBrowser";
import ShoppingList from "./components/ShoppingList";

function App() {
  const [view, setView] = useState("planner");
  const [mealPlan, setMealPlan] = useState([]);

  function handleGoShopping() {
    setView("shopping");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header view={view} onChangeView={setView} />

      <main>
        {view === "planner" && (
          <WeekPlanner
            mealPlan={mealPlan}
            onPlanChange={setMealPlan}
            onGoShopping={handleGoShopping}
          />
        )}
        {view === "recipes" && <RecipeBrowser />}
        {view === "shopping" && <ShoppingList mealPlan={mealPlan} />}
      </main>

      <footer className="text-center text-xs text-gray-400 py-8 mt-8 border-t border-gray-100">
        <p>
          Macros based on{" "}
          <span className="font-medium">USDA Dietary Guidelines for Americans</span> (children 4–12 years)
        </p>
        <p className="mt-1">
          Carbs 45–65% · Protein 10–30% · Fat 25–35% of total calories
        </p>
      </footer>
    </div>
  );
}

export default App;

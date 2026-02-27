import { useState } from "react";
import { recipes, categories } from "../data/recipes";
import RecipeCard from "./RecipeCard";

export default function RecipeBrowser() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showHiddenVegOnly, setShowHiddenVegOnly] = useState(false);

  const filtered = recipes.filter((r) => {
    const matchesCategory = activeCategory === "All" || r.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ingredients.some((i) => i.item.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesHiddenVeg = !showHiddenVegOnly || r.hiddenVeg.length > 0;
    return matchesCategory && matchesSearch && matchesHiddenVeg;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Recipe Library</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {recipes.length} balanced kid-friendly dinners
        </p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search recipes or ingredients…"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
      />

      {/* Filters */}
      <div className="flex gap-2 flex-wrap items-center">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === cat
                ? "bg-orange-400 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}

        <label className="flex items-center gap-1.5 ml-auto text-xs text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showHiddenVegOnly}
            onChange={(e) => setShowHiddenVegOnly(e.target.checked)}
            className="accent-green-500"
          />
          🥷 Hidden veg only
        </label>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-sm">No recipes match your search.</p>
        </div>
      )}
    </div>
  );
}

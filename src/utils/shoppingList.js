/**
 * Generates a consolidated shopping list from a meal plan.
 *
 * Groups items into supermarket-aisle categories for convenience.
 * Attempts to combine duplicate ingredients (e.g. two recipes both
 * needing onions will show as a single line with a higher quantity).
 */

const AISLE_MAP = {
  // Produce
  carrot: "🥦 Fruit & Veg",
  carrots: "🥦 Fruit & Veg",
  celery: "🥦 Fruit & Veg",
  spinach: "🥦 Fruit & Veg",
  "baby spinach": "🥦 Fruit & Veg",
  courgette: "🥦 Fruit & Veg",
  courgettes: "🥦 Fruit & Veg",
  onion: "🥦 Fruit & Veg",
  "spring onions": "🥦 Fruit & Veg",
  garlic: "🥦 Fruit & Veg",
  "garlic cloves": "🥦 Fruit & Veg",
  "garlic clove": "🥦 Fruit & Veg",
  mushrooms: "🥦 Fruit & Veg",
  "sweet potatoes": "🥦 Fruit & Veg",
  "sweet potato": "🥦 Fruit & Veg",
  "butternut squash": "🥦 Fruit & Veg",
  "cauliflower florets": "🥦 Fruit & Veg",
  "mixed peppers": "🥦 Fruit & Veg",
  avocado: "🥦 Fruit & Veg",
  "red cabbage": "🥦 Fruit & Veg",
  tomato: "🥦 Fruit & Veg",
  "lettuce leaves": "🥦 Fruit & Veg",
  lime: "🥦 Fruit & Veg",
  lemon: "🥦 Fruit & Veg",

  // Meat & Fish
  "beef mince": "🥩 Meat & Fish",
  "chicken mince": "🥩 Meat & Fish",
  "chicken breast": "🥩 Meat & Fish",
  "chicken thighs": "🥩 Meat & Fish",
  "white fish fillets": "🥩 Meat & Fish",
  "tinned salmon": "🥩 Meat & Fish",

  // Dairy & Eggs
  egg: "🥚 Dairy & Eggs",
  eggs: "🥚 Dairy & Eggs",
  "cheddar cheese": "🥚 Dairy & Eggs",
  cheddar: "🥚 Dairy & Eggs",
  mozzarella: "🥚 Dairy & Eggs",
  "parmesan": "🥚 Dairy & Eggs",
  "whole milk": "🥚 Dairy & Eggs",
  butter: "🥚 Dairy & Eggs",
  "crème fraîche": "🥚 Dairy & Eggs",
  "half-fat crème fraîche": "🥚 Dairy & Eggs",
  ricotta: "🥚 Dairy & Eggs",
  "ricotta cheese": "🥚 Dairy & Eggs",
  "natural yogurt": "🥚 Dairy & Eggs",
  "greek yogurt": "🥚 Dairy & Eggs",
  "cheddar slices": "🥚 Dairy & Eggs",

  // Dry Goods / Pasta / Rice
  "penne pasta": "🍝 Dry Goods",
  "macaroni pasta": "🍝 Dry Goods",
  "penne": "🍝 Dry Goods",
  "pasta twists": "🍝 Dry Goods",
  "jumbo pasta shells": "🍝 Dry Goods",
  "long-grain rice": "🍝 Dry Goods",
  "basmati rice": "🍝 Dry Goods",
  "red lentils": "🍝 Dry Goods",
  "cannellini beans": "🍝 Dry Goods",
  "plain flour": "🍝 Dry Goods",
  "self-raising flour": "🍝 Dry Goods",
  breadcrumbs: "🍝 Dry Goods",
  "panko breadcrumbs": "🍝 Dry Goods",

  // Tins & Jars
  "tinned tomatoes": "🥫 Tins & Jars",
  "tomato purée": "🥫 Tins & Jars",
  "tinned sweetcorn": "🥫 Tins & Jars",
  sweetcorn: "🥫 Tins & Jars",
  "frozen peas": "🥫 Tins & Jars",
  "coconut milk": "🥫 Tins & Jars",
  "roasted red peppers": "🥫 Tins & Jars",
  "vegetable stock": "🥫 Tins & Jars",
  "cooked beetroot": "🥫 Tins & Jars",

  // Bakery
  "wholemeal buns": "🥖 Bakery",
  "crusty bread rolls": "🥖 Bakery",

  // Wraps & Pizza
  "large flour tortillas": "🫓 Wraps & Bread",
  "mini tortilla wraps": "🫓 Wraps & Bread",
  "pizza bases": "🫓 Wraps & Bread",
};

function getAisle(itemName) {
  const lower = itemName.toLowerCase();
  for (const [key, aisle] of Object.entries(AISLE_MAP)) {
    if (lower.includes(key.toLowerCase())) return aisle;
  }
  return "🛒 Other";
}

/**
 * Builds a grouped shopping list from a meal plan (array of recipe objects).
 * Returns: { [aisle]: [{ item, amount, recipes }] }
 */
export function buildShoppingList(mealPlan) {
  // Flatten all ingredients
  const allIngredients = [];
  for (const recipe of mealPlan) {
    for (const ing of recipe.ingredients) {
      allIngredients.push({ ...ing, recipeName: recipe.name, recipeEmoji: recipe.emoji });
    }
  }

  // Merge by item name (case-insensitive, strip parentheticals for key)
  const merged = {};
  for (const ing of allIngredients) {
    const key = ing.item
      .toLowerCase()
      .replace(/\s*\(.*?\)/g, "")
      .trim();

    if (!merged[key]) {
      merged[key] = {
        item: ing.item.replace(/\s*\(.*?\)/g, "").trim(),
        amounts: [ing.amount],
        recipes: [{ name: ing.recipeName, emoji: ing.recipeEmoji }],
        aisle: getAisle(ing.item),
      };
    } else {
      merged[key].amounts.push(ing.amount);
      if (!merged[key].recipes.find((r) => r.name === ing.recipeName)) {
        merged[key].recipes.push({ name: ing.recipeName, emoji: ing.recipeEmoji });
      }
    }
  }

  // Group by aisle
  const grouped = {};
  for (const entry of Object.values(merged)) {
    if (!grouped[entry.aisle]) grouped[entry.aisle] = [];

    // Summarise amount: if multiple, just note the count
    const amountDisplay =
      entry.amounts.length > 1
        ? `${entry.amounts[0]} (×${entry.amounts.length} recipes)`
        : entry.amounts[0];

    grouped[entry.aisle].push({
      item: entry.item,
      amount: amountDisplay,
      recipes: entry.recipes,
      multipleRecipes: entry.recipes.length > 1,
    });
  }

  // Sort aisles and items within each aisle
  const sorted = {};
  const aisleOrder = [
    "🥦 Fruit & Veg",
    "🥩 Meat & Fish",
    "🥚 Dairy & Eggs",
    "🍝 Dry Goods",
    "🥫 Tins & Jars",
    "🥖 Bakery",
    "🫓 Wraps & Bread",
    "🛒 Other",
  ];

  for (const aisle of aisleOrder) {
    if (grouped[aisle]) {
      sorted[aisle] = grouped[aisle].sort((a, b) => a.item.localeCompare(b.item));
    }
  }

  return sorted;
}

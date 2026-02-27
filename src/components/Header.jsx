export default function Header({ view, onChangeView }) {
  const navItems = [
    { id: "planner", label: "🗓 Week Planner" },
    { id: "recipes", label: "📖 All Recipes" },
    { id: "shopping", label: "🛒 Shopping List" },
  ];

  return (
    <header className="bg-gradient-to-r from-orange-400 to-pink-500 shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            onClick={() => onChangeView("planner")}
            className="text-left"
          >
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              🍽 KidsMeals
            </h1>
            <p className="text-orange-100 text-sm">
              Balanced dinners kids actually eat
            </p>
          </button>

          <nav className="flex gap-2 flex-wrap">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  view === item.id
                    ? "bg-white text-orange-500 shadow-md"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

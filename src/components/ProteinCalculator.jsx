import React, { useState, useMemo } from "react";
import Footer from "./Footer";

// ProteinCalculator.jsx
// Single-file React component styled with Tailwind CSS
// Default export a React component ready to paste into a React + Tailwind project (Vite / Create React App / Next.js)

export default function ProteinCalculator() {
  // Inputs
  const [weight, setWeight] = useState(70); // default kg
  const [unit, setUnit] = useState("kg"); // 'kg' or 'lb'
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("sedentary");
  const [goal, setGoal] = useState("maintenance");
  const [calories, setCalories] = useState(2500);
  const [meals, setMeals] = useState(3);
  const [customFactor, setCustomFactor] = useState(1.0); // g/kg
  const [useCustom, setUseCustom] = useState(false);

  // Preset factors (g/kg)
  const presets = {
    "RDA (adult)": 0.8,
    "Older adult": 1.2,
    "Active / endurance": 1.4,
    "Strength / hypertrophy": 1.6,
    "High (cut/retain LBM)": 1.8,
    "Very high (bodybuilders)": 2.2,
  };

  // Map some selects to recommended ranges
  const activityToFactor = {
    sedentary: 0.8,
    moderately_active: 1.0,
    active: 1.4,
    athlete: 1.6,
  };

  const goalToFactor = {
    maintenance: null, // use activity
    hypertrophy: 1.6,
    weight_loss: 1.8,
    older_adult: 1.2,
    pregnancy: 1.1,
  };

  // Convert input to kg
  const weightKg = useMemo(() => {
    if (unit === "kg") return Number(weight) || 0;
    // lb -> kg
    return (Number(weight) || 0) * 0.45359237;
  }, [weight, unit]);

  // Decide factor (g/kg) selected
  const selectedFactor = useMemo(() => {
    if (useCustom && customFactor > 0) return Number(customFactor);
    // If user picks a goal that forces a value
    if (goalToFactor[goal]) return goalToFactor[goal];
    // Otherwise derive from activity
    return activityToFactor[activity] ?? 0.8;
  }, [useCustom, customFactor, goal, activity]);

  // Core calculations
  const proteinGrams = useMemo(() => {
    return Number((weightKg * selectedFactor).toFixed(1));
  }, [weightKg, selectedFactor]);

  const proteinKcal = useMemo(() => proteinGrams * 4, [proteinGrams]);
  const proteinPercent = useMemo(() => {
    if (!calories || calories <= 0) return 0;
    return Number(((proteinKcal / Number(calories)) * 100).toFixed(1));
  }, [proteinKcal, calories]);

  const perMeal = useMemo(() => {
    if (!meals || meals <= 0) return proteinGrams;
    return Number((proteinGrams / meals).toFixed(1));
  }, [proteinGrams, meals]);

  // Per-meal MPS suggestion: 0.25 g/kg per meal as common heuristic
  const perMealMPS = useMemo(() => {
    const val = Number((weightKg * 0.25).toFixed(1));
    return val;
  }, [weightKg]);

  // Validation helpers
  const invalid = weightKg <= 0 || age <= 0 || calories < 0 || meals <= 0;

  // Small helper to pretty print factor range
  const factorLabel = () => `${selectedFactor} g/kg`;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl text-amber-400 font-semibold">
          Protein Needs Calculator
        </h1>
        <p className="text-sm text-gray-200 mt-1">
          Estimasi harian protein berdasarkan berat badan dan tujuan. Bukan
          pengganti nasihat medis.
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT: Form */}
        <section className="col-span-2 bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg font-medium mb-3">Input</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Weight + unit */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Berat
              </label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  min="0"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="flex-1 input input-bordered w-full p-2 rounded-lg border"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="p-2 rounded-lg border"
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </select>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {unit === "lb" ? `${(weight * 0.45359237).toFixed(1)} kg` : ""}
              </p>
            </div>

            {/* Age + Gender */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Usia
              </label>
              <input
                type="number"
                min="0"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="mt-1 p-2 rounded-lg border w-full"
              />

              <label className="block text-sm font-medium text-slate-700 mt-3">
                Jenis kelamin
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="mt-1 p-2 rounded-lg border w-full"
              >
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
                <option value="other">Lainnya</option>
              </select>
            </div>

            {/* Activity + Goal */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Aktivitas
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="mt-1 p-2 rounded-lg border w-full"
              >
                <option value="sedentary">
                  Sedentary (little/no exercise)
                </option>
                <option value="moderately_active">
                  Moderately active (1–3x/wk)
                </option>
                <option value="active">Active (3–5x/wk)</option>
                <option value="athlete">
                  Athlete (daily / high intensity)
                </option>
              </select>

              <label className="block text-sm font-medium text-slate-700 mt-3">
                Tujuan
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="mt-1 p-2 rounded-lg border w-full"
              >
                <option value="maintenance">Maintenance</option>
                <option value="hypertrophy">Hypertrophy / Build muscle</option>
                <option value="weight_loss">Weight loss (retain LBM)</option>
                <option value="older_adult">
                  Older adult / sarcopenia prevention
                </option>
                <option value="pregnancy">Pregnancy / Lactation</option>
              </select>
            </div>

            {/* Calories + Meals */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Kalori harian (opsional)
              </label>
              <input
                type="number"
                min="0"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                className="mt-1 p-2 rounded-lg border w-full"
              />

              <label className="block text-sm font-medium text-slate-700 mt-3">
                Jumlah makan per hari
              </label>
              <input
                type="number"
                min="1"
                value={meals}
                onChange={(e) => setMeals(Number(e.target.value))}
                className="mt-1 p-2 rounded-lg border w-full"
              />
            </div>

            {/* Presets and custom factor */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">
                Presets cepat
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(presets).map(([name, val]) => (
                  <button
                    key={name}
                    onClick={() => {
                      setUseCustom(false);
                      setCustomFactor(val);
                      setGoal("maintenance");
                      setActivity("sedentary");
                      setCustomFactor(val);
                      setUseCustom(true);
                    }}
                    className="px-3 py-1 rounded-full border text-sm hover:bg-slate-50"
                  >
                    {name}
                  </button>
                ))}
              </div>

              <div className="mt-4 border rounded-lg p-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={useCustom}
                    onChange={(e) => setUseCustom(e.target.checked)}
                  />
                  <span className="text-sm">Gunakan faktor kustom (g/kg)</span>
                </label>

                {useCustom && (
                  <div className="mt-3">
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.1"
                      value={customFactor}
                      onChange={(e) => setCustomFactor(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>0.5</span>
                      <span>{customFactor.toFixed(1)} g/kg</span>
                      <span>3.0</span>
                    </div>
                  </div>
                )}

                {!useCustom && (
                  <p className="text-xs text-slate-400 mt-2">
                    Faktor saat ini: <strong>{factorLabel()}</strong>{" "}
                    (ditentukan oleh pemilihan tujuan / aktivitas)
                  </p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <p className="text-xs text-slate-500">
                Tips: Untuk stimulasi sintesis protein otot per-meal, heuristik
                umum adalah ~0.25 g/kg per makan atau 20–40 g protein/porsi
                (lebih tinggi pada lanjut usia). Selalu sebutkan disclaimer.
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT: Output Card */}
        <aside className="col-span-1">
          <div className="bg-white rounded-2xl shadow p-5 sticky top-6">
            <h3 className="text-lg font-medium">Hasil estimasi</h3>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Berat (kg)</span>
                <strong>{weightKg.toFixed(1)} kg</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Faktor dipakai</span>
                <strong>{factorLabel()}</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Protein / hari</span>
                <strong>{invalid ? "—" : `${proteinGrams} g`}</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-600">
                  Protein / porsi ({meals}x)
                </span>
                <strong>{invalid ? "—" : `${perMeal} g`}</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-600">
                  % kalori dari protein
                </span>
                <strong>
                  {calories > 0 ? `${proteinPercent}%` : "Masukkan kalori"}
                </strong>
              </div>

              <div className="pt-3 border-t mt-2">
                <p className="text-xs text-slate-500">
                  MPS heuristic / per-meal: <strong>{perMealMPS} g</strong>{" "}
                  (0.25 g/kg)
                </p>
                <p className="text-xs text-amber-700 mt-2">
                  Catatan: Ini estimasi. Konsultasikan ke profesional saat ada
                  kondisi medis.
                </p>
              </div>

              {/* Quick actions */}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() =>
                    navigator.clipboard?.writeText(
                      `Protein recommendation: ${proteinGrams} g/day (${perMeal} g x ${meals}), ${proteinPercent}% of ${calories} kcal/day`
                    )
                  }
                  className="flex-1 py-2 rounded-lg border hover:bg-slate-50 text-sm"
                >
                  Salin hasil
                </button>
                <button
                  onClick={() => window.print()}
                  className="py-2 px-3 rounded-lg border hover:bg-slate-50 text-sm"
                >
                  Cetak
                </button>
              </div>
            </div>
          </div>

          {/* References card */}
          <div className="mt-4 bg-white rounded-2xl shadow p-4 text-xs text-slate-500">
            <strong className="block mb-2">Referensi singkat</strong>
            <ul className="list-disc pl-4 space-y-1">
              <li>RDA dewasa sehat: ~0.8 g/kg.</li>
              <li>Atlet / strength: 1.4–2.0 g/kg (ISSN review).</li>
              <li>
                Older adults: rekomendasi 1.0–1.2 g/kg untuk mencegah
                sarcopenia.
              </li>
              <li>AMDR protein: 10–35% dari total kalori.</li>
            </ul>
          </div>

          <div className="mt-4 text-xs text-slate-400">
            Disclaimer: Tool ini memberikan estimasi umum dan bukan pengganti
            saran medis atau dietitian.
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}

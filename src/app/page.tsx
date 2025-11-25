"use client";

import { useEffect, useState } from "react";

const greenHouseShades = [
  { name: "50", value: "#f3fce9" },
  { name: "100", value: "#e4f7d0" },
  { name: "200", value: "#cbf0a6" },
  { name: "300", value: "#a9e373" },
  { name: "400", value: "#8ad447" },
  { name: "500", value: "#6bb929" },
  { name: "600", value: "#50941c" },
  { name: "700", value: "#3e711a" },
  { name: "800", value: "#355a1a" },
  { name: "900", value: "#2f4e1b" },
  { name: "950", value: "#152a09" },
];

export default function Home() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Check system preference on mount
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    // Toggle the `dark` class on the <html> element
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="flex items-center justify-between px-8 py-6 border-b border-border">
        <h1 className="text-2xl font-bold">Green House Palette</h1>
        <button
          type="button"
          onClick={() => setDark((d) => !d)}
          className="rounded-full px-5 py-2 font-medium bg-green-house-600 text-white hover:bg-green-house-700 transition-colors"
        >
          {dark ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
        </button>
      </header>

      <main className="max-w-5xl mx-auto py-12 px-6">
        <section>
          <h2 className="text-xl font-semibold mb-6">Paleta de colores</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {greenHouseShades.map((shade) => (
              <div
                key={shade.name}
                className="flex flex-col items-center rounded-lg overflow-hidden shadow-md"
              >
                <div
                  className="w-full h-20"
                  style={{ backgroundColor: shade.value }}
                />
                <div className="w-full py-2 text-center bg-card text-card-foreground text-sm font-medium">
                  <span className="block">{shade.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {shade.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Uso de las clases Tailwind</h2>
          <div className="space-y-3">
            <p className="text-muted-foreground">
              Puedes usar estas utilidades directamente en tus componentes:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 text-foreground">
              <li>
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                  bg-green-house-500
                </code>{" "}
                – Fondo
              </li>
              <li>
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                  text-green-house-700
                </code>{" "}
                – Color de texto
              </li>
              <li>
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                  border-green-house-300
                </code>{" "}
                – Borde
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl p-6 bg-green-house-100 text-green-house-900">
            <h3 className="font-semibold">Card clara</h3>
            <p className="text-sm mt-2">
              Usando <code>bg-green-house-100</code> y{" "}
              <code>text-green-house-900</code>.
            </p>
          </div>
          <div className="rounded-xl p-6 bg-green-house-500 text-white">
            <h3 className="font-semibold">Card media</h3>
            <p className="text-sm mt-2">
              Usando <code>bg-green-house-500</code> y <code>text-white</code>.
            </p>
          </div>
          <div className="rounded-xl p-6 bg-green-house-900 text-green-house-100">
            <h3 className="font-semibold">Card oscura</h3>
            <p className="text-sm mt-2">
              Usando <code>bg-green-house-900</code> y{" "}
              <code>text-green-house-100</code>.
            </p>
          </div>
        </section>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border mt-12">
        Fútbol Academia &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

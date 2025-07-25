import React, { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="text-xl px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
    >
      {darkMode ? "🌙" : "☀️"}
    </button>
  );
};

export default ThemeToggle;

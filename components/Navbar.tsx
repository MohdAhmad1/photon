import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTheme } from "next-themes";

const Navbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="flex shadow-lg shadow-md w-full py-4 px-4 shadow-true-gray-400 items-center justify-between sm:px-14 dark:shadow-true-gray-600">
      <h1 className="font-bold text-xl">Photon</h1>

      <div className="w-6/12 md:w-1/2 sm:w-2/3">
        <input
          className="border border-transparent rounded-lg bg-light-400 w-full py-2 px-4 transition-shadow duration-150 dark:bg-dark-500 dark:hover:bg-dark-400 dark:focus:border-dark-200 dark:focus:ring-dark-300"
          type="search"
          name="search"
          id="search"
          placeholder="Search anything..."
        />
      </div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        className="rounded-lg flex bg-light-400 p-2 items-center justify-center dark:bg-dark-500 hover:bg-light-500"
        onClick={() => {
          setTheme(theme === "dark" ? "light" : "dark");
        }}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <AnimatePresence exitBeforeEnter>
            {theme === "dark" && (
              <motion.path
                key="0"
                initial={{ y: "-100%" }}
                animate={{ y: "0" }}
                exit={{ y: "-100%" }}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            )}

            {theme !== "dark" && (
              <motion.path
                key="1"
                initial={{ y: "100%" }}
                animate={{ y: "0" }}
                exit={{ y: "100%" }}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            )}
          </AnimatePresence>
        </svg>
      </motion.button>
    </nav>
  );
};

export default Navbar;

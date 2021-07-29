import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";

const MoonSVG = () => (
  <motion.svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ y: "120%" }}
    animate={{ y: "0" }}
    exit={{ y: "120%" }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </motion.svg>
);

const SunSVG = () => (
  <motion.svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ y: "-120%" }}
    animate={{ y: "0" }}
    exit={{ y: "-120%" }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </motion.svg>
);

const Navbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="flex shadow-lg shadow-md w-full py-4 px-4 shadow-true-gray-400 items-center justify-between sm:px-14 dark:shadow-true-gray-600">
      <Link href="/" passHref>
        <a>
          <h1 className="font-bold text-xl">Photon</h1>
        </a>
      </Link>

      <div className="w-6/12 md:w-1/2 sm:w-2/3">
        <input
          className="border border-transparent rounded-lg bg-light-500 w-full py-2 px-4 transition-shadow duration-150 focus:ring focus:ring-light-900 hover:bg-light-600 dark:bg-dark-200 dark:hover:bg-dark-100 dark:focus:border-dark-50 dark:focus:ring-dark-50"
          type="search"
          name="search"
          id="search"
          placeholder="Search anything..."
        />
      </div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        className="cursor-pointer flex bg-light-500 rounded-1 p-2 overflow-hidden items-center justify-center dark:bg-dark-200 dark:hover:bg-dark-100 hover:bg-light-600"
        onClick={() => {
          setTheme(theme === "dark" ? "light" : "dark");
        }}
      >
        <AnimatePresence exitBeforeEnter>
          {theme === "dark" ? <MoonSVG key={0} /> : <SunSVG key={1} />}
        </AnimatePresence>
      </motion.button>
    </nav>
  );
};

// <svg
//   className="h-6 w-6"
//   fill="none"
//   stroke="currentColor"
//   viewBox="0 0 24 24"
//   xmlns="http://www.w3.org/2000/svg"
// >
//   <AnimatePresence exitBeforeEnter>
//     {theme === "dark" && (
//       <motion.path
//         key="0"
//         initial={{ y: "100%" }}
//         animate={{ y: "0" }}
//         exit={{ y: "100%" }}
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
//       />
//     )}

//     {theme !== "dark" && (
//       <motion.path
//         key="1"
//         initial={{ y: "-100%" }}
//         animate={{ y: "0" }}
//         exit={{ y: "-100%" }}
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
//       />
//     )}
//   </AnimatePresence>
// </svg>;

export default Navbar;

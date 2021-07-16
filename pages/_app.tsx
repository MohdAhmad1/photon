import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";

// components
import Navbar from "../components/Navbar";

// styles
import "windi.css";
import "../styles/all.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <Navbar />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
export default MyApp;

import { ThemeProvider } from "next-themes";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";

import Navbar from "./Navbar";
import nProgress from "nprogress";

import type { FC } from "react";

const Layout: FC = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeStart", nProgress.start);
    router.events.on("routeChangeComplete", nProgress.done);
    router.events.on("routeChangeError", nProgress.done);

    return () => {
      router.events.off("routeChangeStart", nProgress.start);
      router.events.off("routeChangeComplete", nProgress.done);
      router.events.off("routeChangeError", nProgress.done);
    };
  }, [router]);

  return (
    <>
      <main>
        <ThemeProvider attribute="class">
          <Navbar />
          {children}
        </ThemeProvider>
      </main>
    </>
  );
};

export default Layout;

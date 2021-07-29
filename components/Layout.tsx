import { ThemeProvider } from "next-themes";
import { FC } from "react";
import Navbar from "./Navbar";

const Layout: FC = ({ children }) => {
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

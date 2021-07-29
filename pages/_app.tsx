import Layout from "components/Layout";
import type { AppProps } from "next/app";

// styles
import "windi.css";
import "../styles/all.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
export default MyApp;

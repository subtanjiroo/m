import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Danh sách trái cây của Anh Thịnhzczczxcxzcx 🍎🍌🍍</title>
        <meta
          name="description"
          content="Xem danh sách các loại trái cây ngon và bổ dưỡng."
        />

        {/* Open Graph */}
        <meta property="og:title" content="Danh sách trái cây Nhà Anh Thịnh 🍎🍌🍍" />
        <meta
          property="og:description"
          content="Xem danh sách các loại trái cây ngon và bổ dưỡng."
        />
        <meta property="og:image" content="https://minhdeptrai.leandix.com/tulalit.jpg" />
        <meta property="og:url" content="https://minhdeptrai.leandix.com/" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Danh sách trái cây Nhà Anh Thịnh 🍎🍌🍍" />
        <meta
          name="twitter:description"
          content="Xem danh sách các loại trái cây ngon và bổ dưỡng."
        />
        <meta name="twitter:image" content="https://minhdeptrai.leandix.com/tulalitjpg" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps, name }) {
  return (
    <>
      <Head>
        <title>Danh sách trái cây của {name} 🍎🍌🍍</title>
        <meta
          name="description"
          content="Xem danh sách các loại trái cây ngon và bổ dưỡng."
        />

        {/* Open Graph */}
        <meta property="og:title" content={`Danh sách trái cây Nhà ${name} 🍎🍌🍍`} />
        <meta
          property="og:description"
          content="Xem danh sách các loại trái cây ngon và bổ dưỡng."
        />
        <meta property="og:image" content="https://minhdeptrai.leandix.com/tulalit.jpg" />
        <meta property="og:url" content="https://minhdeptrai.leandix.com/" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Danh sách trái cây Nhà ${name} 🍎🍌🍍`} />
        <meta
          name="twitter:description"
          content="Xem danh sách các loại trái cây ngon và bổ dưỡng."
        />
        <meta name="twitter:image" content="https://minhdeptrai.leandix.com/tulalit.jpg" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}

// Hàm này sẽ chạy ở server khi load trang
MyApp.getInitialProps = async (appContext) => {
  let name = "Ẩn danh";
  try {
    const res = await fetch("https://minhdeptrai.leandix.com/api/hello");
    const data = await res.json();
    name = data.name || name;
  } catch (error) {
    console.error("Lỗi fetch API:", error);
  }

  const appProps = await import("next/app").then((mod) =>
    mod.default.getInitialProps(appContext)
  );

  return { ...appProps, name };
};

export default MyApp;

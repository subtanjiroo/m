// pages/_app.tsx
import type { AppProps } from "next/app";
import Head from "next/head";
import '../src/sections/ChatBox/index.css'
import '../styles/globals.css'; // Import global styles
const siteMeta = {
  title: "Danh sách trái câyzxczxczxc  🍎🍌🍍",
  description: "Xem danh sách các loại trái cây ngon và bổ dưỡng.",
  url: "https://platform.leandix.com",
  image: "/LEANDIX.png",
};

const openGraphMeta: { property: string; content: string }[] = [
  { property: "og:title", content: siteMeta.title },
  { property: "og:description", content: siteMeta.description },
  { property: "og:image", content: siteMeta.image },
  { property: "og:url", content: siteMeta.url },
  { property: "og:type", content: "website" },
];

const twitterMeta: { name: string; content: string }[] = [
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: siteMeta.title },
  { name: "twitter:description", content: siteMeta.description },
  { name: "twitter:image", content: siteMeta.image },
];

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <script src="https://cdn.tailwindcss.com"></script>
        <title>{siteMeta.title}</title>
        <meta name="description" content={siteMeta.description} />

        {/* Open Graph */}
        {openGraphMeta.map(({ property, content }) => (
          <meta key={property} property={property} content={content} />
        ))}

        {/* Twitter Card */}
        {twitterMeta.map(({ name, content }) => (
          <meta key={name} name={name} content={content} />
        ))}
      </Head>

      <Component {...pageProps} />
    </>
  );
}

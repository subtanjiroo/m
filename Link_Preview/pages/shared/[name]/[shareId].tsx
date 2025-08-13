// pages/shared/[name]/[shareId].tsx
import Head from "next/head";
import ChatBox from "@/sections/ChatBox";
import { Button } from "@/components/ui/button";
import type { Message } from "@/types";
import { useRouter } from "next/router";

export default function SharedChatPage({
  name,
  shareId,
  messages,
}: {
  name: string;
  shareId: string;
  messages: Message[];
}) {
  const router = useRouter();

  return (
    <>
      <Head>
        {/* Title và description */}
        <title>{name ? `${name} - Shared Chat` : "Shared Chat"}</title>
        <meta
          name="description"
          content={`Chat shared by ${name || "someone"}`}
        />

        {/* Open Graph meta tags */}
        <meta property="og:title" content={name || "Shared Chat"} />
        <meta
          property="og:description"
          content={`Chat shared by ${name || "someone"}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/shared/${name}/${shareId}`} />
        {/* Nếu muốn có ảnh preview */}
        {/* <meta property="og:image" content={`${process.env.NEXT_PUBLIC_SITE_URL}/images/share-preview.png`} /> */}
      </Head>

      <div className="h-dvh w-screen bg-slate-900">
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
          <div className="flex justify-items-end mx-auto px-6 py-4">
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 transition-all duration-300"
              onClick={() => router.push("https://platform.leandix.com/reasoning")}
            >
              Về trang chủ
            </Button>
          </div>
        </header>
        <div className="pt-20">
          {shareId && (
            <ChatBox
              chatHistoryID={Number(shareId)}
              chatTitle=""
              setChatHistoryID={() => {}}
              fetchChatHistory={() => {}}
              isCollapsed={false}
              onToggleCollapse={() => {}}
              initialMessages={messages}
              readOnly={true}
              header={false}
            />
          )}
        </div>
      </div>
    </>
  );
}

// Server-Side Rendering
export async function getServerSideProps(context) {
  const { req, params } = context;
  const { name, shareId } = params;

  const host = req.headers.host;
  const baseUrl = `http://link_preview-nextjs-1:4000`;
  // const baseUrl = `http://localhost:4000`;
  console.log("Base URL:", baseUrl);
  const apiUrl = `${baseUrl}/api/chat/${shareId}`;
  const res = await fetch(apiUrl);

  if (!res.ok) {
    return {
      redirect: {
        destination: "/shared/notfound",
        permanent: false,
      },
    };
  }

  const data = await res.json();

  return {
    props: {
      name,
      shareId,
      messages: data.messages || [],
    },
  };
}

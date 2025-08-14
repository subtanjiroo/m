import Head from "next/head";
import { Button } from "@/components/ui/button";
import MarkdownRenderer from "@/tools/RenderMarkdown";
import type { Message } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react"
import React from "react"; // thêm dòng này
const modelLabels = {
  gpt: "OpenAI",
  deepseek: "DeepSeek",
  perplexity: "Tìm kiếm",
  grok: "Grok 3",
  gemini: "Gemini",
  claude: "Claude",
  synthesis: "Tổng hợp"
} as const;
type ModelKey = keyof typeof modelLabels;
 
export default function SharedChatPage({ name, shareId, messages }: { name: string; shareId: string; messages: Message[] }) {
  const router = useRouter();
  const bottomRef = React.useRef<HTMLDivElement>(null);

  // Scroll xuống cuối khi render xong
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Xử lý preloader sau khi load trang
  React.useEffect(() => {
    const hidePreloader = () => {
      const pre = document.getElementById("preloader");
      if (pre) {
        pre.style.opacity = "0";
        setTimeout(() => pre.remove(), 300);
      }
    };

    hidePreloader(); // ẩn khi component mount
    router.events.on("routeChangeComplete", hidePreloader);

    return () => {
      router.events.off("routeChangeComplete", hidePreloader);
    };
  }, []);
  return (
    <>
      <Head>
        <title>{name ? `${name} - Shared Chat` : "Shared Chat"}</title>
        <meta name="description" content={`Chat shared by ${name || "someone"}`} />
        <meta property="og:title" content={name || "Shared Chat"} />
        <meta property="og:description" content={`Chat shared by ${name || "someone"}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/shared/${name}/${shareId}`} />
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

        <div className="pt-20 flex-1 flex flex-col h-full overflow-y-auto p-4 space-y-4 bg-slate-900">
          {messages.map((msg, index) => {
            console.log("Message:", msg);
            const key = msg.model as ModelKey;
            return (
              <div className={`flex ${msg.type === "bot" ? "justify-start flex-col" : "justify-end"}`}>
                {msg.type === "user" && (
                  <div className="max-w-[90%] p-4 rounded-lg whitespace-pre-line bg-white text-black rounded-tr-sm">
                    {msg.content}
                  </div>
                )}

                {msg.type === "bot" && (
                  <div className="max-w-[90%] p-4 rounded-lg bg-gray-800 rounded-bl-sm">
                    <div className="self-start mb-1">
                      <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm px-2 py-1 rounded mb-3">
                        {modelLabels[msg.model as ModelKey]}
                      </span>
                    </div>
                    <div className="text-white">
                      <MarkdownRenderer markdownText={msg.content} />
                    </div>
                  </div>
                )}
                </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        
      </div>
    </>
  );
}

// Server-Side Rendering
export async function getServerSideProps(context) {
  const { req, params } = context;
  const { name, shareId } = params;

  const baseUrl = `https://platform.leandix.com/api/chat/history/share/${shareId}`;
  const res = await fetch(baseUrl);

  if (!res.ok) {
    return {
      redirect: {
        destination: "/shared/notfound",
        permanent: false,
      },
    };
  }

  const data = await res.json();

  // Map dữ liệu API về type Message hiện tại
  const messages: Message[] = (data.data?.chat_messages || []).map((msg, index) => ({
    id: index,              // nếu API không có id thì dùng index
    content: msg.message,    // API trả 'message', type đang dùng 'content'
    type: msg.is_machine ? "bot" : "user",
    model: msg.model
  }));
  
  return {
    props: {
      name,
      shareId,
      messages,
    },
  };
}

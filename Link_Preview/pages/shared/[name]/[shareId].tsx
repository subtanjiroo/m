// pages/shared/[name]/[shareId].tsx
import { useRouter } from "next/router";
import ChatBox from "@/sections/ChatBox";
import { Button } from "@/components/ui/button";
import type { Message } from "@/types";

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
    <div className="h-dvh w-screen bg-slate-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex justify-items-end mx-auto px-6 py-4">
          <Button
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 transition-all duration-300"
            onClick={() => router.push("https://platform.leandix.com")}
          >
            Về trang chủ
          </Button>
        </div>
      </header>
      <div className="pt-20">
        <ChatBox
          chatHistoryID={Number(shareId)}
          initialMessages={messages}
          readOnly
          header={false}
          setChatHistoryID={() => {}}
          fetchChatHistory={() => {}}
          isCollapsed={false}
          onToggleCollapse={() => {}}
          chatTitle=""
        />
      </div>
    </div>
  );
}

// SSR với getServerSideProps
export async function getServerSideProps({ params }) {
  const { name, shareId } = params;
  const baseUrl = `http://link_preview-nextjs-1:3000`;
  const res = await fetch(`${baseUrl}/api/chat/${shareId}`);

  if (!res.ok) {
    return {
      redirect: { destination: "/shared/notfound", permanent: false },
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

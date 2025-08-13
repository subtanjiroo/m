// pages/shared/[name]/[shareId].tsx
import ChatBox from "@/sections/ChatBox";
import type { Message } from "@/types";

export default function SharedChatPage({ name, shareId, messages }: { name: string, shareId: string, messages: Message[] }) {
  return (
    <div className="h-dvh w-screen bg-slate-900">
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

export async function getServerSideProps({ params }) {
  const { name, shareId } = params;
  const baseUrl = `http://link_preview-nextjs-1:3000`;
  const res = await fetch(`${baseUrl}/api/chat/${shareId}`);

  if (!res.ok) {
    return { redirect: { destination: '/shared/notfound', permanent: false } };
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

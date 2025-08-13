import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import ChatBox from "@/sections/ChatBox"
import { Button } from "@/components/ui/button"
import { API_ENDPOINTS } from "@/constants/config"
import type { Message } from "@/types"  

const SharedChatPage: React.FC = () => {
  const { shareId } = useParams()
  const [messages, setMessages] = useState<Message[]>()
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_ENDPOINTS.GET_SHARE_CHAT}${shareId}`)
      if (!res.ok) navigate("/shared/notfound")
      const json = await res.json()

      const raw = json.data?.chat_messages || []
      const formatted: Message[] = raw.map((m: any, idx: number) => ({
        id: m.id ?? Date.now() + idx,
        content: m.message,
        type: m.is_machine ? "bot" : "user",
        model: m.model || "",
      }))
      setMessages(formatted)
    }
    load()
  }, [])

  return (
    <div className="h-dvh w-screen bg-slate-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex justify-items-end mx-auto px-6 py-4">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 transition-all duration-300"
            onClick={() => navigate("/")}
          >
            Về trang chủ
          </Button>
        </div>
      </header>

      <div className="mt-17">
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
      </div>
    </div>
  )
}

export default SharedChatPage

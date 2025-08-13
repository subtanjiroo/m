import { useEffect, useState } from "react"
import { API_ENDPOINTS } from "@/constants/config"
import ChatLibrary from "@/sections/ChatLibrary"
import ChatBox from "@/sections/ChatBox"
import { useNavigate } from "react-router-dom"

interface ChatHistoryItem {
  id: number
  title: string
  timestamp: string
}

const ReasoningPage: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([])
  const [chatTitle, setChatTitle] = useState<string>("")
  const [selectedChatID, setSelectedChatID] = useState<number>(0)
  const [isLibraryCollapsed, setIsLibraryCollapsed] = useState(false)
  const navigate = useNavigate()

  const fetchChatHistory = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.GET_CHAT_HISTORY, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const resJson = await res.json()
      if (!res.ok) {
        throw new Error(resJson.message || "Lỗi tải Thư viện")
      }
      const data = resJson.data.chat_histories as ChatHistoryItem[]
      setChatHistory(data)
      console.log(chatHistory)
    } catch (err: unknown) {
      console.error(err)
      navigate("/")
    }
  }

  useEffect(() => {
    console.log(chatHistory)
    const selectedChat = chatHistory.find(chat => chat.id === selectedChatID);
    if (selectedChat) setChatTitle(selectedChat.title ?? `Chat #${selectedChat.id}`)
    else setChatTitle("Cuộc trò chuyện mới")
  }, [selectedChatID])
  
  // Hiện thực một lần duy nhất khi mount component
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsLibraryCollapsed(true)
    }
    fetchChatHistory()
  }, [])

  const handleNewConversation = () => {
    if (window.innerWidth < 780) { setIsLibraryCollapsed(true) }
    setSelectedChatID(0)
  }


  return (
    <div className="flex h-dvh w-screen bg-slate-900">
      <ChatLibrary
        chatHistory={chatHistory}
        selectedChatID={selectedChatID}
        onNewConversation={handleNewConversation}
        onSelectConversation={(id) => setSelectedChatID(id)}
        isCollapsed={isLibraryCollapsed}
        onToggleCollapse={() => setIsLibraryCollapsed((prev) => !prev)}
        fetchChatHistory={fetchChatHistory}
      />
      <ChatBox
        chatHistoryID={selectedChatID}
        chatTitle={chatTitle}
        setChatHistoryID={(id) => setSelectedChatID(id)}
        fetchChatHistory={fetchChatHistory}
        onToggleCollapse={() => setIsLibraryCollapsed((prev) => !prev)}
        isCollapsed={isLibraryCollapsed}
        initialMessages={[]}
        readOnly={false}
        header={true}
      />
    </div>
  )
}

export default ReasoningPage

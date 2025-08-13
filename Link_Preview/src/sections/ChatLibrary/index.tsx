import { useConfirm } from "@/components/NotiConfirm"
import { Plus, Menu } from "lucide-react"
import { useEffect, useRef } from "react"
import { API_ENDPOINTS } from "@/constants/config"

interface ChatItem {
  id: number
  title: string
  timestamp: string
}

interface ChatLibraryProps {
  chatHistory: ChatItem[]
  selectedChatID: number | null
  onNewConversation: () => void
  onSelectConversation: (id: number) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  fetchChatHistory: () => void
}

const ChatLibrary: React.FC<ChatLibraryProps> = ({
  chatHistory,
  selectedChatID,
  onNewConversation,
  onSelectConversation,
  isCollapsed,
  onToggleCollapse,
  fetchChatHistory,
}) => {
  const confirm = useConfirm()
  const now = new Date()
  const todayList: ChatItem[] = []
  const weekList: ChatItem[] = []
  const older: ChatItem[] = []
  const other: ChatItem[] = []

  const libRef = useRef<HTMLDivElement>(null)

  // Sắp xếp cuộc trò chuyện
  chatHistory.forEach((c) => {
    if (c.timestamp) {
      const d = new Date(c.timestamp)
      const diff = now.getTime() - d.getTime()
      if (diff < 24 * 60 * 60 * 1000) {
        todayList.push(c)
      } else if (diff < 7 * 24 * 60 * 60 * 1000) {
        weekList.push(c)
      } else {
        older.push(c)
      }
    } else {
      other.push(c)
    }
  })

  // Hàm xóa cuộc trò chuyện
  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    const ok = await confirm("Bạn có chắc muốn xóa không?")
    if (!ok) return
    try {
      const response = await fetch(`${API_ENDPOINTS.DELETE_CHAT}${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      const resJson = await response.json()
      if (!response.ok) {
        throw new Error(resJson.data?.message || "Có lỗi không xác định")
      }
      fetchChatHistory()
      onSelectConversation(0)
    } catch (err: unknown) {
      console.error("Xóa thất bại:", err)
    }
  }

  const renderItem = (c: ChatItem) => (
    <div
      key={c.id}
      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-slate-700 ${
        selectedChatID === c.id ? "bg-slate-600" : "bg-slate-800"
      }`}
      onClick={() => {
        if (window.innerWidth < 780) { onToggleCollapse() }
        onSelectConversation(c.id)
      }}
    >
      <span className="text-slate-200 w-40 truncate whitespace-nowrap overflow-hidden">{c.title}</span>
      <button className="p-1" onClick={(e) => handleDelete(e, c.id)}>
        <img className="w-4 h-4" src="./delete_icon.svg" alt="delete_icon" />
      </button>
    </div>
  )

  useEffect(() => {
    if (window.innerWidth > 768) return
    const checkClick = (event: MouseEvent) => {
      if (
        !isCollapsed &&
        libRef.current && event.target instanceof Node &&
        !libRef.current.contains(event.target)
      ) {
        onToggleCollapse()
      }
    }
    document.addEventListener("mousedown", checkClick)
    return () => document.removeEventListener("mousedown", checkClick)
  }, [isCollapsed])

  return (
    <div ref={libRef} className={`absolute z-100 h-full sm:relative bg-slate-800 transition-all duration-200 border-r-1 border-slate-600 flex flex-col ${isCollapsed ? "w-0 overflow-hidden" : "w-64"}`}>
      <div className="p-4 flex items-center justify-between border-b border-slate-600 bg-slate-800">
        <span className="text-white font-medium text-xl">Thư viện</span>
        <button onClick={onToggleCollapse} className="p-1 hover:bg-slate-700 rounded">
          <Menu className="mt-1 w-5 h-5" color="white"/>
        </button>
      </div>
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <button
            onClick={onNewConversation}
            className="flex items-center w-full justify-between text-slate-300 hover:text-white hover:bg-slate-700 rounded p-2"
          >
            <span>Cuộc trò chuyện mới</span>
            <Plus className="w-4 h-4 ml-2" />
          </button>

          {todayList.length > 0 && (
            <div>
              <span className="text-gray-400 text-sm mb-2">Hôm nay</span>
              <div className="space-y-2">{todayList.map(renderItem)}</div>
            </div>
          )}

          {weekList.length > 0 && (
            <div>
              <span className="text-gray-400 text-sm mb-2">Trong 7 ngày</span>
              <div className="space-y-2">{[...weekList].reverse().map(renderItem)}</div>
            </div>
          )}

          {older.length > 0 && (
            <div>
              <span className="text-gray-400 text-sm mb-2">Cũ hơn</span>
              <div className="space-y-2">{[...older].reverse().map(renderItem)}</div>
            </div>
          )}

          {other.length > 0 && (
            <div>
              <span className="text-gray-400 text-sm mb-2">Khác</span>
              <div className="space-y-2">{[...other].reverse().map(renderItem)}</div>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatLibrary

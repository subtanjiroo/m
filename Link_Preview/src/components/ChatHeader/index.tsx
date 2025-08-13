import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useConfirm, useNotify } from "../NotiConfirm"
import { useNavigate } from "react-router-dom"
import { Menu } from "lucide-react"
import { API_ENDPOINTS } from "@/constants/config"
import { API_DOMAIN } from "@/constants/config"
import { useEffect, useState } from "react"
import { BetaBadge } from "../BetaBadge"
import { Share2 } from "lucide-react"
import SettingsDialog from "../SettingsDialog"
import ShareDialog from "../ShareDialog"

interface ChatHeaderProps {
  onToggleCollapse: () => void
  isCollapsed: boolean
  chatHistoryID: number | null
  chatTitle: string
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onToggleCollapse, isCollapsed, chatHistoryID, chatTitle
}) => {
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [userName, setUserName] = useState<string>("Leandix")
  const [userEmail, setUserEmail] = useState<string>("info@gmail.com")
  const [isShared, setIsShared] = useState<boolean>(false)
  const [shareURL, setShareURL] = useState<string>("")
  const [isSharePanelOpen, setIsSharePanelOpen] = useState(false);
  const notify = useNotify()

  const handleShare = async (s: boolean) => {
    if (!chatHistoryID) return

    try {
      console.log(JSON.stringify({ is_shared: s }))
      const response = await fetch(
        `${API_ENDPOINTS.PUT_SHARE_CHAT}${chatHistoryID}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_shared: s }),
        }
      )

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Lỗi share")
      }

      console.log(response)
      setIsShared(s)

      const url = `${API_DOMAIN}/shared/${chatHistoryID}`
      setShareURL(url)

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi share không xác định"
      notify(msg, { type: "error" })
    }
  }

  const checkShareable = async () => {
    if (!chatHistoryID) return
    const res = await fetch(`${API_ENDPOINTS.GET_CHAT_STATUS}${chatHistoryID}`, { method:"GET", credentials:"include" })
    if (res.ok) {
      const json = await res.json();
      const data = json.data
      console.log("Status:", data.is_shared)
      setIsShared(Boolean(data.is_shared))
      setShareURL(`${API_DOMAIN}/shared/${chatHistoryID}`)
    }
  }

  const fetchUserInfo = async () => {
    try {
      const res = await fetch(`${API_ENDPOINTS.GET_USER}`, {
        method: "GET",
        credentials: "include"
      })

      if (!res.ok) {
        const err = await res.json()
        throw Error(err.message || "Lỗi không xác định!")
      }

      const json = await res.json()
      const data = json.data
      setUserName(data.name)
      setUserEmail(data.email)
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    checkShareable()
    fetchUserInfo()
  }, [])

  useEffect(() => {
    checkShareable()
  }, [chatHistoryID])

  const handleLogout = async (): Promise<void> => {
    const ok = await confirm("Bạn có chắc muốn thoát không?")
    if (!ok) return

    try {
      const response = await fetch(API_ENDPOINTS.LOGOUT, {
        method: "POST",
        credentials: "include",
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || "Có lỗi trong quá trình xử lý đăng xuất!")
      }
      navigate("/")
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Đã có lỗi xảy ra"
      console.error(message)
    }
  }

  return (
    <div className="sticky top-0 flex items-center justify-between p-4 border-b border-slate-600 bg-slate-900">
      <div className="flex gap-3">
        {isCollapsed && <button onClick={onToggleCollapse} className="p-1 hover:bg-slate-700 rounded">
          <Menu className="w-5 h-5" color="white"/>
        </button>}
        <span className="text-white font-medium text-xl">Trò chuyện</span>
        <BetaBadge wid={10} />
        {Boolean(chatHistoryID) && (<div>
          <span className="mr-2 text-white font-medium text-xl truncate max-w-[18ch]">
            {"| "}{chatTitle}
          </span>
        </div>)}
      </div>

      <div className="flex items-center gap-3">
        {Boolean(chatHistoryID) && (<Button 
          variant="outline" 
          size="sm" 
          className="text-slate-700 border-slate-600"
          onClick={() => setIsSharePanelOpen(true)}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Chia sẻ
        </Button>)}

        <Button
          variant="outline"
          size="sm"
          className="text-slate-700 border-slate-600"
          onClick={handleLogout}
        >
          Thoát
        </Button>
        <Avatar className="w-8 h-8" onClick={() => setIsVisible(!isVisible)}>
          <AvatarFallback className="bg-slate-600 text-white text-sm">
            {userName.charAt(0).toUpperCase()}  
          </AvatarFallback>
        </Avatar>
      </div>
      <SettingsDialog
        isVisible={isVisible}
        userName={userName}
        userEmail={userEmail}
        onClose={() => setIsVisible(false)}
        onSettingsClick={() => navigate("/settings")} 
      />
      <ShareDialog 
        isOpen={isSharePanelOpen}
        onClose={() => setIsSharePanelOpen(false)}
        shareUrl={shareURL}
        isShared={isShared}
        handleShare={handleShare}
      />
    </div>
  )
}

export default ChatHeader

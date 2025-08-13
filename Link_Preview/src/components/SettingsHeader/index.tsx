import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import type { UserInfo } from "@/types"
import { API_ENDPOINTS } from "@/constants/config"

interface SettingsHeaderProps {
  sectionTitle: string
  isNavCollapsed: boolean
}

const SettingsHeader = ({ sectionTitle }: SettingsHeaderProps) => {
  const navigate = useNavigate()
  const [currData, setCurrData] = useState<UserInfo>()

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${API_ENDPOINTS.GET_USER}`, {
        method: "GET",
        credentials: "include"
      })

      if (!res.ok) {
        const err = await res.json()
        throw Error(err.message || "Lỗi lấy thông tin người dùng!")
      }
      const json = await res.json()
      setCurrData(json.data)

    } catch(err) {
      console.log(err)
    }
  }

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

  useEffect(() => {
    fetchUserData()
  }, [])

  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-700">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/reasoning")}
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Trở về
        </Button>
        <span className="text-slate-500">|</span>
        <span className="text-white font-semibold text-xl">{sectionTitle}</span>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-slate-700 border-slate-600"
          onClick={handleLogout}  
        >
          Thoát
        </Button>
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-slate-600 text-white text-sm">
            {currData?.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

export default SettingsHeader
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { API_ENDPOINTS } from "@/constants/config"
import { Copy } from "lucide-react"

interface APIKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (name: string) => Promise<string>
}

const APIKeyDialog = ({ open, onOpenChange, onSubmit}: APIKeyDialogProps) => {
  const [name, setName] = useState("")
  const [isAPIKeyCreated, setIsAPIKeyCreated] = useState<boolean | null>(null)
  const [apiKey, setApiKey] = useState("")

  const handleCreateAPIKey = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      console.log("name", name.trim())
      const apiRes = await fetch(`${API_ENDPOINTS.PR_API_CREATE}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() })
      })

      if (!apiRes.ok) {
        const err = await apiRes.json()
        throw Error(err.message || "Lỗi tạo API!")
      }
      console.log("apiRes", apiRes)

      const json = await apiRes.json()
      console.log("json", json)
      const response_api_key = json.data.API_key
      console.log("response_api_key", response_api_key)
      setApiKey(response_api_key)
      setName("")
      setIsAPIKeyCreated(true)
    }
  }

  const handleCloseDialog = () => {
    setIsAPIKeyCreated(null)
    setName("")
    setApiKey("")
    onOpenChange(false)
  }

  const handleCopyAPIKey = () => {
    navigator.clipboard.writeText(apiKey)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!isAPIKeyCreated && (
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo API Key mới</DialogTitle>
          </DialogHeader>
        
          <form onSubmit={handleCreateAPIKey} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-slate-300">Tên API Key</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Nhập tên cho API Key..."
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 border-slate-600 text-slate-700"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Tạo
              </Button>
            </div>
          </form>
        </DialogContent>
      )}
      {isAPIKeyCreated && (
        <DialogContent className="bg-slate-800 border-slate-700 text-white sm:max-w-2xl w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">Lưu API key của bạn</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 overflow-y-auto max-h-[80vh]">
            <p className="text-slate-300 text-base">
              Vui lòng lưu API key của bạn ở nơi an toàn vì bạn sẽ không thể xem lại nó. 
              Hãy bảo mật key này, vì bất kỳ ai có API key đều có thể thực hiện yêu cầu thay mặt bạn. 
              Nếu bạn làm mất key, bạn sẽ cần tạo một key mới.
            </p>
            
            <a href="#" className="text-blue-400 hover:text-blue-300 underline inline-flex items-center">
              Tìm hiểu thêm về các phương pháp hay nhất về API key
              <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            <div className="bg-slate-900 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="w-full min-w-0">
                <code className="text-slate-300 font-mono text-sm block truncate break-all">{apiKey}</code>
              </div>
              <Button
                onClick={handleCopyAPIKey}
                variant="outline"
                className="shrink-0 border-slate-600 hover:bg-slate-700 whitespace-nowrap w-full sm:w-auto bg-white text-black hover:text-white"
              >
                <Copy className="w-4 h-4" />
                <span className="ml-2">Sao chép</span>
              </Button>
            </div>

            

            <Button
              onClick={handleCloseDialog}
              className="w-full bg-slate-700 hover:bg-slate-600 mt-4"
            >
              Xong
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}

export default APIKeyDialog
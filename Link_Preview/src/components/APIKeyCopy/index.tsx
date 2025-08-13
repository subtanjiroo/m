import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Copy } from "lucide-react"
import { useNotify } from "../NotiConfirm"

interface APIKeyCopyProps {
  isOpen: boolean
  onClose: () => void
  api_key: string
}

const APIKeyCopy = ({ 
  isOpen,
  onClose,
  api_key
}: APIKeyCopyProps) => {
  const notify = useNotify()
  const copyToClipboard = async () => {    
    try {
      await navigator.clipboard.writeText(api_key)
      notify("Đã sao chép API key", {type: "success", duration: 5000})
    } catch (err) {
      notify(`Không thể sao chép API Key: ${err}`, {type: "error", duration: 5000})
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API Key</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Copy link section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">API Key</label>
            <div className="flex gap-2">
              <Input
                value={api_key}
                readOnly
                className="flex-1"
              />
              <Button onClick={copyToClipboard} size="icon" variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default APIKeyCopy
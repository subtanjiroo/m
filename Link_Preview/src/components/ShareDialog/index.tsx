import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Copy } from "lucide-react"
import { useNotify } from "../NotiConfirm"
import { Switch } from "../ui/switch"

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  shareUrl?: string
  isShared: boolean
  handleShare: (s: boolean) => Promise<void>
}

const ShareDialog = ({ 
  isOpen,
  onClose,
  shareUrl = window.location.href,
  isShared,
  handleShare
}: ShareDialogProps) => {
  const notify = useNotify()
  const copyToClipboard = async () => {
    if (!isShared) {
      notify("Bạn phải bật chia sẻ trước!", {type: "error", duration: 3000})
      return
    }
    
    try {
      await navigator.clipboard.writeText(shareUrl)
      notify("Đã sao chép", {type: "success", duration: 5000})
    } catch (err) {
      notify(`Không thể sao chép liên kết: ${err}`, {type: "error", duration: 5000})
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chia sẻ cuộc trò chuyện</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Share activation status */}
          <div className="flex gap-2">
            <label className="text-sm font-medium pt-2 pb-2">Trạng thái chia sẻ</label>
            <div className="p-2">
              <Switch 
                defaultChecked={isShared}
                onCheckedChange={() => handleShare(!isShared)}
              />
            </div>
          </div>
          {/* Copy link section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sao chép liên kết</label>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
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

export default ShareDialog
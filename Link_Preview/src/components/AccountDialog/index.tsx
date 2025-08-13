import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { UserInfo } from "@/types"

interface AccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentData: UserInfo
  onSubmit: (data: UserInfo) => void
}

const AccountDialog = ({ open, onOpenChange, currentData, onSubmit }: AccountDialogProps) => {
  const [formData, setFormData] = useState(currentData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin tài khoản</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-slate-300">Họ và tên</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Nhập họ và tên..."
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-slate-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Nhập email..."
              required
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-slate-300">Số điện thoại</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Nhập số điện thoại..."
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
              Lưu
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AccountDialog
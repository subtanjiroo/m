import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Task {
  id: string
  name: string
  time: string
  frequency: string
  isActive: boolean
  prompt: string
}

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (taskData: Omit<Task, 'id'>) => void
  editingTask?: Task | null
}

const TaskDialog = ({ open, onOpenChange, onSubmit, editingTask }: TaskDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    time: "",
    frequency: "Hàng ngày",
    isActive: true,
    prompt: "",
  })

  useEffect(() => {
    if (editingTask) {
      setFormData({
        name: editingTask.name,
        time: editingTask.time,
        frequency: editingTask.frequency,
        isActive: editingTask.isActive,
        prompt: editingTask.prompt,
      })
    } else {
      setFormData({
        name: "",
        time: "",
        frequency: "Hàng ngày",
        isActive: true,
        prompt: "",
      })
    }
  }, [editingTask, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      name: "",
      time: "",
      frequency: "Hàng ngày",
      isActive: true,
      prompt: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingTask ? "Chỉnh sửa Task" : "Tạo Task mới"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-slate-300">Tên Task</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="time" className="text-slate-300">Thời gian</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="frequency" className="text-slate-300">Tần suất</Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) => setFormData({ ...formData, frequency: value })}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="Hàng ngày">Hàng ngày</SelectItem>
                <SelectItem value="Mỗi Thứ 2">Mỗi Thứ 2</SelectItem>
                <SelectItem value="Mỗi Thứ 3">Mỗi Thứ 3</SelectItem>
                <SelectItem value="Mỗi Thứ 4">Mỗi Thứ 4</SelectItem>
                <SelectItem value="Mỗi Thứ 5">Mỗi Thứ 5</SelectItem>
                <SelectItem value="Mỗi Thứ 6">Mỗi Thứ 6</SelectItem>
                <SelectItem value="Mỗi Thứ 7">Mỗi Thứ 7</SelectItem>
                <SelectItem value="Mỗi Chủ nhật">Mỗi Chủ nhật</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="prompt" className="text-slate-300">Prompt</Label>
            <Textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
              rows={3}
              placeholder="Nhập prompt sẽ được gửi tự động..."
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
              {editingTask ? "Cập nhật" : "Tạo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default TaskDialog
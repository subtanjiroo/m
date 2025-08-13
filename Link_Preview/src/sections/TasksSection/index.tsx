import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit } from "lucide-react"
import TaskDialog from "@/components/TaskDialog"

interface Task {
  id: string
  name: string
  time: string
  frequency: string
  isActive: boolean
  prompt: string
}

const TasksSection = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleCreateTask = (taskData: Omit<Task, 'id'>) => {
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
    }
    setTasks([...tasks, newTask])
    setIsDialogOpen(false)
  }

  const handleEditTask = (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...taskData, id: editingTask.id }
          : task
      ))
      setEditingTask(null)
      setIsDialogOpen(false)
    }
  }

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, isActive: !task.isActive } : task
    ))
  }

  const openCreateDialog = () => {
    setEditingTask(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (task: Task) => {
    setEditingTask(task)
    setIsDialogOpen(true)
  }

  if (tasks.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Tasks</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Tasks cho phép bạn lên lịch gửi các prompt tự động theo thời gian định trước. 
              Tạo task đầu tiên để bắt đầu tự động hóa quy trình làm việc của bạn.
            </p>
            <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Tạo Task
            </Button>
          </CardContent>
        </Card>

        <TaskDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleCreateTask}
          editingTask={editingTask}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-xl font-semibold">Tasks</h2>
        <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Tạo Task
        </Button>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">TÊN</TableHead>
                <TableHead className="text-slate-300">THỜI GIAN</TableHead>
                <TableHead className="text-slate-300">TRẠNG THÁI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} className="border-slate-700">
                  <TableCell className="text-white">{task.name}</TableCell>
                  <TableCell className="text-slate-300">{task.time}</TableCell>
                  <TableCell>
                    <Switch
                      checked={task.isActive}
                      onCheckedChange={() => toggleTaskStatus(task.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(task)}
                      className="text-slate-300 hover:text-white"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Sửa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={editingTask ? handleEditTask : handleCreateTask}
        editingTask={editingTask}
      />
    </div>
  )
}

export default TasksSection
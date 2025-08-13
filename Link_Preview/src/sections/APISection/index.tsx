

import { use, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"
import APIKeyDialog from "@/components/APIKeyDialog"
import type { PrivateAPIKey } from "@/types"
import { API_ENDPOINTS } from "@/constants/config"
import { Switch } from "@/components/ui/switch"
import { useConfirm } from "@/components/NotiConfirm"
// import APIKeyCopy from "@/components/APIKeyCopy"

const APISection = () => {
  const [apiKeys, setApiKeys] = useState<PrivateAPIKey[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const confirm = useConfirm()

  const fetchAPIkey = async () => {
    try {
      const apiRes = await fetch(`${API_ENDPOINTS.PR_API_LIST}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      })

      if (!apiRes.ok) {
        const err = await apiRes.json()
        throw Error(err.message || "Lỗi nhận API!")
      }

      const json = await apiRes.json()
      const response_api_keys = json.data
      console.log(response_api_keys)
      setApiKeys([])

      response_api_keys.forEach((api_key: any) => {
        const newAPIKey: PrivateAPIKey = {
          id: api_key.id,
          name: api_key.name,
          api_first_3: api_key.api_first_3,
          api_last_3: api_key.api_last_3,
          last_used: api_key.last_used,
          active: api_key.active
        }
        setApiKeys(prevKeys => [...prevKeys, newAPIKey])
      })
    } catch(err) {
      console.log(err)
      return
    }

    setIsDialogOpen(false)
  }

  useEffect(() => {
    fetchAPIkey()
  }, [apiKeys.length])

  const handleCreateAPIKey = async (name: string) => {
    try {
      const apiRes = await fetch(`${API_ENDPOINTS.PR_API_CREATE}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name })
      })

      if (!apiRes.ok) {
        const err = await apiRes.json()
        throw Error(err.message || "Lỗi tạo API!")
      }

      const json = await apiRes.json()
      const response_api_keys = json.data.API_key
      fetchAPIkey()
      return response_api_keys

      
    } catch(err) {
      console.log(err)
      return
    }

    setIsDialogOpen(false)
  }

  const handleToggleStatus = async (id: number, newStatus: boolean) => {
    try {
      const apiRes = await fetch(`${API_ENDPOINTS.PR_API_STATUS_TOGGLE}${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })

      if (!apiRes.ok) {
        const err = await apiRes.json()
        throw Error(err.message || "Lỗi cập nhật trạng thái API!")
      }

      setApiKeys(prevKeys => 
        prevKeys.map(key => 
          key.id === id ? { ...key, active: newStatus } : key
        )
      )
    } catch(err) {
      console.log(err)
    }
  }

  const handleDeleteAPIKey = async (id: number, name: string) => {
    const confirmed = await confirm(`Bạn có chắc chắn muốn xóa API key "${name}" không?`)
    if (!confirmed) return

    try {
      const apiRes = await fetch(`${API_ENDPOINTS.PR_API_DELETE}${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      })

      if (!apiRes.ok) {
        const err = await apiRes.json()
        throw Error(err.message || "Lỗi xóa API!")
      }

      setApiKeys(prevKeys => prevKeys.filter(key => key.id !== id))
    } catch(err) {
      console.log(err)
    }
  }

  if (apiKeys.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">API Keys</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              API Keys cho phép bạn truy cập các dịch vụ và tính năng của hệ thống một cách an toàn. 
              Tạo API Key để bắt đầu tích hợp với các ứng dụng khác.
            </p>
            <Button 
              onClick={() => setIsDialogOpen(true)} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo API Key
            </Button>
          </CardContent>
        </Card>

        <APIKeyDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleCreateAPIKey}

        />

        {/* <APIKeyCopy
          isOpen={isCopyOpen}
          onClose={() => setIsCopyOpen(false)}
          api_key={APItoCopy}
        /> */}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-xl font-semibold">API Keys</h2>
        <Button 
          onClick={() => setIsDialogOpen(true)} 
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo API Key
        </Button>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="justify-items-center border-slate-700">
                <TableHead className="text-slate-300">TÊN</TableHead>
                <TableHead className="text-slate-300">API KEY</TableHead>
                <TableHead className="text-slate-300">DÙNG LẦN CUỐI</TableHead>
                <TableHead className="text-slate-300">TRẠNG THÁI</TableHead>
                <TableHead className="text-slate-300 w-[100px]">THAO TÁC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.name} className="border-slate-700">
                  <TableCell className="text-white">{apiKey.name}</TableCell>
                  <TableCell className="text-slate-300">{`${apiKey.api_first_3}...${apiKey.api_last_3}`}</TableCell>
                  <TableCell className="text-slate-300">{apiKey.last_used ? new Date(apiKey.last_used).toLocaleString() : "Chưa sử dụng"}</TableCell>
                  <TableCell className="text-slate-300">
                    <Switch
                      checked={apiKey.active}
                      onCheckedChange={(checked) => handleToggleStatus(apiKey.id, checked)}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-red-500/10 hover:text-red-500"
                      onClick={() => handleDeleteAPIKey(apiKey.id, apiKey.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <APIKeyDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateAPIKey}
      />
    </div>
  )
}

export default APISection
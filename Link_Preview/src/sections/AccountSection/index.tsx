import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Edit } from "lucide-react"
import AccountDialog from "@/components/AccountDialog"
import { API_ENDPOINTS } from "@/constants/config"
import type { UserInfo, UserUsage } from "@/types"

interface AccountSectionProps {
  userInfo: UserInfo,
  setUserInfo: (data: UserInfo) => void
}


const AccountSection: React.FC<AccountSectionProps> = ({
  userInfo,
  setUserInfo
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [accountData, setAccountData] = useState<UserInfo>(userInfo)
  const [usageData, setUsageData] = useState<UserUsage[]>([])

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
      setAccountData(json.data)
      setUserInfo(json.data)


      const usageRes = await fetch(`${API_ENDPOINTS.GET_USER_USAGE}`, {
        method: "GET",
        credentials: "include"
      })
      if (!usageRes.ok) {
        const err = await usageRes.json()
        throw Error(err.message || "Lỗi lấy thông tin sử dụng!")
      }
      const usageJson = await usageRes.json()
      setUsageData(usageJson.data.usage)
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const handleAccountUpdate = async (newData: { name: string; email: string; phone: string }) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.UPDATE_USER}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData)
      })

      if (!res.ok) {
        const err = await res.json()
        throw Error(err.message || "Lỗi cập nhật thông tin người dùng!")
      }

      setUserInfo(newData)
      setAccountData(newData)
      console.log("Account updated:", newData)
      
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div className="space-y-6 overflow-y-auto">
      {/* Account Info */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Tài khoản</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-slate-600 text-white text-lg">
                  {accountData.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-white font-medium">{accountData.name}</h3>
                <p className="text-slate-400">{accountData.email}</p>
                <p className="text-slate-400">{accountData.phone}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-slate-700 border-slate-600"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Sửa
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Chart */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Sử dụng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis 
                  dataKey="day" 
                  stroke="#94a3b8"
                  label={{ value: 'Ngày trong tháng', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  label={{ value: 'Tokens', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Bar 
                  dataKey="tokens" 
                  fill="#3b82f6" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Account Edit Dialog */}
      <AccountDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentData={accountData}
        onSubmit={handleAccountUpdate}
      />
    </div>
  )
}

export default AccountSection
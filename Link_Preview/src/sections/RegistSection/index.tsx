import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import React, { useState } from "react"
import type { FormEvent } from "react"
import { API_ENDPOINTS } from "@/constants/config"

interface RegistData {
  email: string
  password: string
  cfpassword: string
}

interface RegistSectionProps {
  setContent: React.Dispatch<React.SetStateAction<string>>,
  setShareRegistData: (data: RegistData) => void
}

const RegistSection: React.FC<RegistSectionProps> = ({
  setContent, setShareRegistData
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [registData, setRegistData] = useState<RegistData>({
    email: "",
    password: "",
    cfpassword: "",
  })
  const [errorEmail, setErrorEmail] = useState<string>("")
  const [error, setError] = useState<string>("")

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  const checkValidEmail = () => {
    setErrorEmail("")
    if (registData.email.trim() === "") {
      setErrorEmail("Email không được để trống!")
      return
    }

    if (registData.email && !isValidEmail(registData.email)) {
      setErrorEmail("Hãy nhập email hợp lệ!")
      return
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const handleRegister = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    
    const { email, password, cfpassword } = registData as RegistData

    if (password !== cfpassword) {
      // notify("Mật khẩu và xác nhận mật khẩu không trùng khớp. Vui lòng kiểm tra lại!", { type: "error", duration: 8000 })
      setRegistData({ ...registData, password: "", cfpassword: ""})
      return
    }

    setLoading(true)
    setShareRegistData(registData) // Lưu lại dữ liệu để resend

    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || "Đăng ký không thành công! Hãy thử lại!")
      }
      setContent("VerifySection")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Đã có lỗi trong quá trình đăng ký! Vui lòng thử lại"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - AI Illustration */}
          <div className="order-3 hidden sm:flex sm:order-1 relative flex justify-end items-end">
            <img
              className="w-140 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-3xl p-8 backdrop-blur-sm border border-purple-500/20"
              src="./regist_img.jpg"
              alt=""
            />
          </div>

          {/* Right Content - Login Form */}
          <div className="order-2 sm:pt-0 space-y-8">
            <Card className="max-w-100 bg-slate-800/80 border-slate-700/50 backdrop-blur-sm justify-center">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-white">
                  Biểu mẫu đăng ký
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="text"
                      placeholder="Email"
                      value={registData.email}
                      onChange={(e) =>
                        setRegistData({ ...registData, email: e.target.value })
                      }
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                      onBlur={checkValidEmail}
                    />
                    {errorEmail && <span className="text-red-300 max-w-80%"> {errorEmail || "Lỗi không xác định."} </span>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-300">
                      Mật khẩu
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
                        value={registData.password}
                        onChange={(e) =>
                          setRegistData({
                            ...registData,
                            password: e.target.value,
                          })
                        }
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-300">
                      Xác nhận mật khẩu
                    </Label>
                    <div className="relative">
                      <Input
                        id="cfpassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu"
                        value={registData.cfpassword}
                        onChange={(e) =>
                          setRegistData({ ...registData, cfpassword: e.target.value })
                        }
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {error && <span className="text-red-300 max-w-80%"> {error || "Lỗi không xác định."} </span>}
                  </div>

                  <Button
                    type="submit"
                    className="mt-2 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 transition-all duration-300"
                    size="lg"
                    disabled={errorEmail.trim() !== ""}
                  >
                    { loading ? "Đang xử lý..." : "Đăng ký" }
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RegistSection

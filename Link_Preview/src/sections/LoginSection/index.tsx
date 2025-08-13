import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_ENDPOINTS } from "@/constants/config"
import type { FormEvent } from "react"

interface LoginData {
  email: string
  password: string
}

const LoginSection = (
  {setContent}: {setContent: React.Dispatch<React.SetStateAction<string>>}
) => {
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [errorEmail, setErrorEmail] = useState<string>("")
  const [errorPassword, setErrorPassword] = useState<string>("")

  const navigate = useNavigate()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const { email, password } = loginData as LoginData
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errRes = await response.json()
        console.error(errRes)
        throw new Error(errRes.message || "Login Failed")
      }

      navigate("/reasoning")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Đã có lỗi xảy ra"
      setErrorPassword(message)
    } finally {
      setLoading(false)
    }
  }

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  const checkValidEmail = () => {
    setErrorEmail("")
    if (loginData.email.trim() === "") {
      setErrorEmail("Email không được để trống!")
      return
    }

    if (loginData.email && !isValidEmail(loginData.email)) {
      setErrorEmail("Hãy nhập email hợp lệ!")
      return
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
              src="./login_img.png"
              alt=""
            />
          </div>

          {/* Right Content - Login Form */}
          <div className="order-2 sm:pt-0 space-y-8">
            <Card className="max-w-100 bg-slate-800/80 border-slate-700/50 backdrop-blur-sm justify-center">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-white">
                  Thông tin đăng nhập
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="text"
                      placeholder="Nhập email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value})}
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
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password:e.target.value})}
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
                    {errorPassword && <span className="text-red-300 max-w-80"> {errorPassword || "Lỗi không xác định."} </span>}
                  </div>

                  <div className="text-center">
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                      onClick={() => setContent("RegistSection")}
                    >
                      Chưa có tài khoản?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 transition-all duration-300"
                    size="lg"
                    disabled={errorEmail.trim() !== ""}
                  >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
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

export default LoginSection

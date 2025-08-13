import { useNotify } from "@/components/NotiConfirm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React, { useState, useEffect, useRef } from "react"
import type { FormEvent } from "react"
import type { MouseEvent } from "react"
import { API_ENDPOINTS } from "@/constants/config"

interface RegistData {
  email: string,
  password: string,
  cfpassword: string
}

interface VerifySectionProps {
  setContent: React.Dispatch<React.SetStateAction<string>>,
  shareRegistData: RegistData
}

const VerifySection: React.FC<VerifySectionProps> = ({
  setContent, shareRegistData
}) => {
  const [code, setCode] = useState("")
  const [counter, setCounter] = useState(59)
  const [resend, setResend] = useState(false)
  const [loading, setLoading] = useState(false)

  const timerRef = useRef(0)
  const notify = useNotify()

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setCounter(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }
          setResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [resend])

  const handleResend = async (e: MouseEvent<HTMLButtonElement>) => {
    setCounter(59)
    setResend(false)
    e.preventDefault()

    const { email, password } = shareRegistData
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
      notify("Đã gửi đăng ký", { type: "success", duration: 8000 })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Đã có lỗi trong quá trình đăng ký! Vui lòng thử lại"
      console.log(message)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (code.trim().length !== 6) {
      notify("Mã xác nhận phải có 06 chữ số!", {type: "error", duration: 5000})
      return
    }

    setLoading(true)
    try {
      const response = await fetch(API_ENDPOINTS.VERIFY_USER, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ verification_code: code.trim() })
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || "Xác thực thất bại!")
      }
      
      notify("Xác thục thành công!", {type: "success", duration: 2000})
      notify("Bạn hãy đăng nhập để tiếp tục", {type: "info", duration: 4000})
      setContent("LoginSection")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Đã xảy ra lỗi trong quá trình xác thực!"
      notify(message || "Xác thực thất bại!", { type: "error", duration: 5000})
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-6">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Content - Illustration */}
          <div className="order-3 hidden sm:flex sm:order-1 relative justify-end items-end">
            <img
              className="w-120 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-3xl p-8 backdrop-blur-sm border border-purple-500/20"
              src="./confirm_img.jpg"
              alt=""
            />
          </div>

          {/* Right Content - Verification Form */}
          <div className="w-auto sm:w-100 order-2 space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-white">
                Xác nhận tài khoản
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed">
                Một mã xác nhận gồm 06 chữ số đã được gửi đến email của bạn. Hãy
                kiểm tra email và điền mã xác nhận vào ô bên dưới.
              </p>
            </div>

            <form onSubmit={handleConfirm} className="space-y-6">
              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="Điền mã xác nhận (06 chữ số)"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 h-14 text-lg"
                  maxLength={6}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 transition-all duration-300 h-12"
                >
                  { loading ? "Đang xử lý..." : "Xác nhận"}
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-600 text-slate-700 hover:bg-slate-700 hover:text-white transition-colors h-12 px-6"
                  disabled={counter > 0}
                  onClick={handleResend}
                >
                  { counter > 0 ? `Chờ ${counter}s` : "Gửi lại" }
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VerifySection

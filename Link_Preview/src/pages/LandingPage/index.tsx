import { useState, useLayoutEffect } from "react"
import { useNavigate } from "react-router-dom"
import HeaderGuest from "@/components/HeaderGuest"
import LandingContent from "@/sections/LandingContent"
import LoginSection from "@/sections/LoginSection"
import RegistSection from "@/sections/RegistSection"
import VerifySection from "@/sections/VerifySection"
import { API_ENDPOINTS } from "@/constants/config"
import { BetaBadge } from "@/components/BetaBadge"

interface RegistData {
  email: string
  password: string
  cfpassword: string
}

const LandingPage = () => {
    const [content, setContent] = useState<string>("LandingContent")
    const [shareRegistData, setShareRegistData] = useState<RegistData>({
        email: "",
        password: "",
        cfpassword: ""
    })

    const navigate = useNavigate()

    const fetchChatHistory = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.LOGIN_STATUS, {
                method: "GET",
                credentials: "include",
            })
            if (!res.ok) throw Error("Rất vui được gặp bạn!")
            navigate("/reasoning")
        } catch (err) {
            console.log(err)
        }
    }

    useLayoutEffect(() => {
        fetchChatHistory()
    }, [])

    return (
        <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 md:overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.1),transparent_50%)]"></div>
            
            
            {/* Content */}
            <div className="relative z-10">
                <HeaderGuest setContent={setContent} />
                <div className="absolute top-6 -ml-12 -rotate-45 z-100">
                    <BetaBadge wid={40}/>
                </div>
                {content === "LandingContent" && (<LandingContent setContent={setContent} />)}
                {content === "LoginSection" && <LoginSection setContent={setContent} />}
                {content === "RegistSection" && (<RegistSection setContent={setContent} setShareRegistData={setShareRegistData} />)}
                {content === "VerifySection" && (<VerifySection setContent={setContent} shareRegistData={shareRegistData} />)}
            </div>
            
        </div>
    )
}

export default LandingPage

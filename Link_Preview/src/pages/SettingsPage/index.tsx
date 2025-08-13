import { useState } from "react"
import SettingsHeader from "@/components/SettingsHeader"
import SettingsNav from "@/sections/SettingsNav"
import AccountSection from "@/sections/AccountSection"
import TasksSection from "@/sections/TasksSection"
import APISection from "@/sections/APISection"
import type { UserInfo } from "@/types"

type SectionType = "account" | "tasks" | "api"

const SettingsPage = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionType>("account")
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    phone: ""
  })

    const getSectionTitle = () => {
    switch (activeSection) {
      case "account":
        return "Tài khoản"
      case "tasks":
        return "Tasks"
      case "api":
        return "API Keys"
      default:
        return "Cài đặt"
    }
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "account":
        return <AccountSection userInfo={userInfo} setUserInfo={setUserInfo}/>
      case "tasks":
        return <TasksSection />
      case "api":
        return <APISection />
      default:
        return <AccountSection userInfo={userInfo} setUserInfo={setUserInfo}/>
    }
  }

  return (
    <div className="h-dvh bg-slate-900 flex">
      <SettingsNav 
        isCollapsed={isNavCollapsed}
        onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="flex-1 overflow-hidden overflow-y-auto">
        <SettingsHeader 
          sectionTitle={getSectionTitle()}
          isNavCollapsed={isNavCollapsed}
        />
        <div className="p-6">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
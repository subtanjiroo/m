import { Button } from "@/components/ui/button"
import { User, ListTodo, Key } from "lucide-react"
import { Menu } from "lucide-react"
import { useRef, useEffect } from "react"

interface SettingsNavProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  activeSection: string
  onSectionChange: (section: "account" | "tasks" | "api") => void
}

const SettingsNav = ({ isCollapsed, onToggleCollapse, activeSection, onSectionChange }: SettingsNavProps) => {
  const menuItems = [
    { id: "account", title: "Tài khoản", icon: User },
    { id: "tasks", title: "Tasks", icon: ListTodo },
    { id: "api", title: "API Keys", icon: Key },
  ]
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.innerWidth > 768) return
    const checkClick = (event: MouseEvent) => {
      if (
        !isCollapsed &&
        navRef.current && event.target instanceof Node &&
        !navRef.current.contains(event.target)
      ) {
        onToggleCollapse()
      }
    }
    document.addEventListener("mousedown", checkClick)
    return () => document.removeEventListener("mousedown", checkClick)
  }, [isCollapsed])

  return (
    <div ref={navRef} className={`absolute z-100 h-dvh sm:relative bg-slate-800 transition-all duration-200 border-r-1 border-slate-600 bg-slate-800 ${isCollapsed ? "w-0 overflow-hidden" : "w-64"}`}>
      <div className="p-4 flex items-center justify-between border-b border-slate-600 bg-slate-800">
        <span className="text-white font-medium text-xl">Cài đặt</span>
        <button onClick={onToggleCollapse} className="p-1 hover:bg-slate-700 rounded">
          <Menu className="mt-1 w-5 h-5" color="white"/>
        </button>
      </div>

      {/* Navigation Menu */}
      <div className="mt-3 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={`w-[90%] ml-3 justify-start transition-colors ${
              activeSection === item.id
                ? 'bg-slate-700 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            onClick={() => onSectionChange(item.id as "account" | "tasks" | "api")}
          >
            <item.icon className="w-full h-4" />
            {item.title}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default SettingsNav
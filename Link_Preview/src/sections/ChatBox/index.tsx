import { useEffect, useRef, useState } from "react"
import { useNotify } from "@/components/NotiConfirm"
import { API_ENDPOINTS } from "@/constants/config"
import ChatHeader from "@/components/ChatHeader"
import { Button } from "@/components/ui/button"
import MarkdownRenderer from "@/tools/RenderMarkdown"
import type { Message } from "@/types"

const modelLabels = {
  gpt: "OpenAI",
  deepseek: "DeepSeek",
  perplexity: "Tìm kiếm",
  grok: "Grok 3",
  gemini: "Gemini",
  claude: "Claude",
  synthesis: "Tổng hợp"
} as const
type ModelKey = keyof typeof modelLabels

interface ChatBoxProps {
  chatHistoryID: number
  
  chatTitle: string
  setChatHistoryID: (id: number) => void
  fetchChatHistory: () => void
  onToggleCollapse: () => void
  isCollapsed: boolean
  initialMessages?: Message[]
  readOnly?: boolean
  header?:boolean
}

const ChatBox: React.FC<ChatBoxProps> = ({
  chatHistoryID,
  chatTitle,
  setChatHistoryID,
  fetchChatHistory,
  onToggleCollapse,
  isCollapsed,
  initialMessages = [],
  readOnly,
  header
}) => {
  const notify = useNotify()

  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isWaiting, setIsWaiting] = useState(false)
  const [sendable, setSendable] = useState(false)

  const [webSearchOn, setWebSearchOn] = useState(true)
  const [grokOn, setGrokOn] = useState(false)
  const [claudeOn, setClaudeOn] = useState(false)
  const [geminiOn, setGeminiOn] = useState(false)
  const [isSynthesis, setIsSynthesis] = useState(false)
  
  const [showOptions, setShowOptions] = useState(false)

  const taRef = useRef<HTMLTextAreaElement>(null)
  const optionRef = useRef<HTMLDivElement>(null)
  const btnOptionRef = useRef<HTMLButtonElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const chatContentRef = useRef<HTMLDivElement>(null)

  const selectedModelCount = [grokOn, claudeOn, geminiOn].filter(
    Boolean
  ).length

  // Điều kiện bật/tắt nút gửi
  useEffect(() => {
    if (isWaiting) {
      setSendable(false)
      return
    }
    if (message == "") {
      setSendable(false)
      return
    }
    setSendable(true)
  }, [isWaiting, message])

  // Lắng nghe phím Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.altKey || e.shiftKey) return
    if (e.key === 'Enter' && !isWaiting) {
      e.preventDefault()
      sendMessage(e)
    }
  }

  // Resize textarea (input field)
  const resize = () => {
    const el = taRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
    const maxH = parseFloat(getComputedStyle(el).maxHeight)
    el.classList.toggle("overflow-y-auto", el.scrollHeight > maxH)
  }

  useEffect(resize, [message])
  useEffect(() => resize(), [])

  // OptionsPanel
  useEffect(() => {
    if (!showOptions) return
    const handleClickOutside = (event: MouseEvent) => {
      if (
      optionRef.current && event.target instanceof Node &&
      !optionRef.current.contains(event.target) &&
      btnOptionRef.current && !btnOptionRef.current.contains(event.target)
    ) {
        setShowOptions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showOptions])

  // Khi chọn >1 model và isSynthesis, tắt isSynthesis
  useEffect(() => {
    if (selectedModelCount < 2 && isSynthesis) {
      setIsSynthesis(false)
    }
    if (selectedModelCount < 1 && !webSearchOn) {
      setWebSearchOn(true)
    }
  }, [selectedModelCount, isSynthesis, webSearchOn])

  // Tải lịch sử chat khi chatHistoryID thay đổi
  useEffect(() => {
    setMessages([])
    const loadHistory = async () => {
      if (chatHistoryID === null || chatHistoryID === 0) return

      const url = `/api/chat/${chatHistoryID}`;
      try {
        const res = await fetch(url,
          {
            method: "GET",
            credentials: "include",
          }
        )
        const resJson = await res.json()
        if (!res.ok) {
          throw Error(resJson.message || JSON.stringify(resJson))
        }
        const raw = resJson.data?.chat_messages || []
        const formatted: Message[] = raw.map((m: any, idx: number) => ({
          id: m.id ?? Date.now() + idx,
          content: m.message,
          type: m.is_machine ? "bot" : "user",
          model: m.model || "",
        }))
        setMessages(formatted)
      } catch (err) {
        console.error("Lỗi load chat history:", err)
      }
    }
    
    loadHistory()

  }, [chatHistoryID, notify])

  // Hàm gửi tin nhắn
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) return
    setIsWaiting(true)
    const userMsg: Message = { id: Date.now(), content: message, type: "user" }
    setMessages((prev) => [...prev, userMsg])
    setMessage("")
    bottomRef.current?.scrollIntoView({ behavior: "smooth"})

    const modelList: string[] = []
    if (grokOn) modelList.push("grok")
    if (claudeOn) modelList.push("claude")
    if (geminiOn) modelList.push("gemini")

    const payload = {
      message: message.trim(),
      chat_history_id: Number(chatHistoryID),
      web_search: webSearchOn,
      model_list: modelList,
      is_synthesis: isSynthesis,
    }

    try {
      const response = await fetch(API_ENDPOINTS.CHAT, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const resJson = await response.json()
      if (!response.ok) {
        throw Error(resJson.message || JSON.stringify(resJson))
      }
      const data = resJson.data
      if (!data) {
        notify("API không gửi về dữ liệu", { type: "error", duration: 4000 })
        setIsWaiting(false)
        return
      }
      if (chatHistoryID === 0 && data.chat_history_id) {
        setChatHistoryID(data.chat_history_id)
      }
      const replies = data.messages || []
      setMessages((prev) => [
        ...prev,
        ...replies.map((msg: any, idx: number) => ({
          id: Date.now() + idx + 1,
          content: msg.message,
          type: "bot",
          model: msg.model
        })),
      ])
      fetchChatHistory()
    } catch (err) {
      console.error("Lỗi gửi message:", err)
      notify("Lỗi gửi message: " + err, { type: "error", duration: 4000 })
    } finally {
      setIsWaiting(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900">
      {/* Header */}
      {header && (<ChatHeader
        onToggleCollapse={onToggleCollapse}
        isCollapsed={isCollapsed}
        chatHistoryID={chatHistoryID}
        chatTitle={chatTitle}
      />)}

      {/* Content */}
      <div ref={chatContentRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900">
        {messages.map((msg) => {
          const key = msg.model as ModelKey
          return (
            <div
              key={msg.id}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start flex-col"
              }`}
            >
              {msg.type === "user" && <div
                className="max-w-[90%] p-4 rounded-lg whitespace-pre-line bg-white text-black rounded-tr-sm"
              >
                {msg.content}
              </div>}

              {msg.type === "bot" && 
                <div className="max-w-[90%] p-4 rounded-lg bg-gray-800 rounded-bl-sm">
                  <div className="self-start mb-1">
                      <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm px-2 py-1 rounded mb-3">
                        {modelLabels[key]}
                      </span>
                  </div>
                  <div className="text-white">
                    <MarkdownRenderer markdownText={msg.content} />
                  </div>
                </div>
              }
            </div>
          )
        })}
        {isWaiting && (
          <div className="flex justify-start items-center space-x-2">
            <div className="animate-pulse text-gray-400">Đang suy nghĩ...</div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Message Form */}
      {!readOnly && (
        <form onSubmit={sendMessage} className="relative flex items-end pl-4 mx-5 mb-3 mt-3 border-[1.5px] border-white/80 rounded-3xl">
          <textarea
            ref={taRef}
            className="text-white my-message-input my-auto-resize placeholder:truncate"
            placeholder="Chào, hãy hỏi để bắt đầu!"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onInput={resize}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            ref={btnOptionRef}
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 mb-0.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
          >
            <img className="w-7" src="models_icon.svg" alt="options" />
          </button>
          <Button
            type="submit"
            size="sm"
            className="bg-transparent mb-2 p-0 hover:bg-transparent"
            disabled={!sendable}
          >
            {sendable ? 
              <img className="w-10 m-2" src="send_enable.png" alt="sendable_icon" />:
              <img className="w-10 m-2" src="send_disable.png" alt="sendunable_icon" />}
          </Button>
        </form>
      )}

      {/* Options Panel */}
      {showOptions && (
        <div
          ref={optionRef}
          className="absolute bottom-[70px] right-[30px] flex items-center justify-center bg-transparent z-50"
        >
          <div className="bg-gray-800 rounded-lg p-6 w-80 border border-solid border-white">
            <div className="space-y-4">
              {/* Tìm kiếm */}
              <div className="flex items-center justify-between">
                <div className="max-w-55">
                  <span className="text-white font-medium">Tìm kiếm</span>
                  <p className="text-gray-400 text-sm">
                    Sử dụng chức năng tìm kiếm theo dữ liệu thời gian thực
                  </p>
                </div>
                <label className="switch-blue">
                  <input
                    type="checkbox"
                    checked={webSearchOn}
                    onChange={() => setWebSearchOn((v) => !v)}
                  />
                  <span className="slider-blue" />
                </label>
              </div>

              <hr className="border-gray-700" />

              {/* Grok */}
              <div className="flex items-center justify-between">
                <div className="max-w-55">
                  <span className="text-white font-medium">Grok</span>
                  <p className="text-gray-400 text-sm">Mô hình lý luận Grok</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={grokOn}
                    onChange={() => setGrokOn((v) => !v)}
                  />
                  <span className="slider" />
                </label>
              </div>

              {/* Claude */}
              <div className="flex items-center justify-between">
                <div className="max-w-55">
                  <span className="text-white font-medium">Claude</span>
                  <p className="text-gray-400 text-sm">
                    Mô hình lý luận Claude
                  </p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={claudeOn}
                    onChange={() => setClaudeOn((v) => !v)}
                  />
                  <span className="slider" />
                </label>
              </div>

              {/* Gemini */}
              <div className="flex items-center justify-between">
                <div className="max-w-55">
                  <span className="text-white font-medium">Gemini</span>
                  <p className="text-gray-400 text-sm">
                    Mô hình lý luận Gemini
                  </p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={geminiOn}
                    onChange={() => setGeminiOn((v) => !v)}
                  />
                  <span className="slider" />
                </label>
              </div>

              <hr className="border-gray-700" />

              {/* Tổng hợp */}
              <div className="flex items-center justify-between">
                <div className="max-w-55">
                  <span className="text-white font-medium">Tổng hợp</span>
                  <p className="text-gray-400 text-sm">
                    Tóm tắt phản hồi từ các mô hình đã chọn
                  </p>
                </div>
                <label className="switch-blue">
                  <input
                    type="checkbox"
                    checked={isSynthesis}
                    onChange={() => setIsSynthesis((v) => !v)}
                    disabled={selectedModelCount < 2}
                  />
                  <span className="slider-blue" />
                </label>
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  )
}

export default ChatBox

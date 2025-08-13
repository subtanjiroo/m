import type { MouseEvent } from "react"

interface SettingsDialogProps {
  isVisible: boolean
  userName: string
  userEmail: string
  onClose: () => void
  onSettingsClick: () => void
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ 
  isVisible,
  userName,
  userEmail,
  onClose,
  onSettingsClick
}) => {
  if (!isVisible) return null

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget)
      onClose()
  }

  return (
    <div
      className="absolute inset-0 bg-transparent top-15 right-0 left-auto min-w-100"
      onClick={handleClick}
    >
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm flex flex-col space-y-4 transform transition-all duration-300 ease-out scale-100 opacity-100">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-blue-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">{userName}</h2>
          <p className="text-sm text-gray-500">{userEmail}</p>
        </div>

        {/* Separator line */}
        <div className="border-t border-gray-200 my-2"></div>

        {/* Settings Button */}
        <button
          onClick={onSettingsClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
        >
          Cài đặt
        </button>

        {/* Optional: Add a close button if needed, although backdrop click also closes */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label="Close panel"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default SettingsDialog
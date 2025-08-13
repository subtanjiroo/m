import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { MessageSquareOff, Home, BookOpen } from "lucide-react"

const ConvNotfound = () => {
	const navigate = useNavigate()

	const handleHomeClick = () => {
		navigate("/")
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
			{/* Background Pattern */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.1),transparent_50%)]"></div>

			{/* Content */}
			<div className="relative z-10 max-w-2xl mx-auto text-center">
				<div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl">
					{/* Icon */}
					<div className="flex justify-center mb-6">
						<div className="bg-rose-500/20 p-4 rounded-full">
							<MessageSquareOff className="w-16 h-16 text-rose-500" />
						</div>
					</div>

					{/* Main Content */}
					<h1 className="text-4xl font-bold text-white mb-4">
						Không tìm thấy cuộc trò chuyện
					</h1>

					<p className="text-xl text-gray-300 mb-6">
						Cuộc trò chuyện tương ứng với đường link bạn đã truy cập hiện <strong>không tồn tại</strong> hoặc <strong>chưa được cấp quyền chia sẻ</strong>.
					</p>

					<p className="text-lg text-gray-400 mb-8">
						Hãy liên hệ với với người đã chia sẻ đường link cuộc trò chuyện cho bạn để chắc chắn rằng cuộc trò chuyện <strong>tồn tại</strong> và <strong>có thể truy cập được</strong>.
					</p>

					{/* Navigation Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							onClick={handleHomeClick}
							className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
						>
							<Home className="w-5 h-5" />
							Trang chủ
						</Button>
						<a href="https://leandix.com">
							<Button
								variant="outline"
								className="hover:no-underline border-white/30 text-gray-700 hover:bg-white/10 hover:text-gray-300 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
							>
								<BookOpen className="w-5 h-5" />
								Trang blogs
							</Button>
						</a>
					</div>

					{/* Additional Info */}
					<div className="mt-8 pt-6 border-t border-white/20">
						<p className="text-sm text-gray-500">
							Nếu bạn cần hỗ trợ khẩn cấp, vui lòng liên hệ với chúng tôi qua email <strong>info@leandix.com</strong>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ConvNotfound
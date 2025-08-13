import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Brain, Cpu } from "lucide-react";

const LandingContent = (
    { setContent } : {setContent: React.Dispatch<React.SetStateAction<string>>}
) => {
  return (
    <section className="min-h-screen flex items-center justify-center sm:pt-15 pt-30 px-6">
      <div className="h-full container mx-auto">
        <div className="grid lg:grid-cols-2 sm:gap20 gap-10 items-center">
          {/* Left Content */}
          <div className="space-y-8 sm:pl-20">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-4xl lg:text-4xl font-bold text-white leading-tight">
                Năng suất vượt trội - Tự động hóa nghiệp vụ với{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  AI Agents
                </span>
                .
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
                Bộ công cụ AI Agents đa năng, tự hỗ trợ ra quyết định đến tạo nội dung và phân tích dữ liệu. Tất cả chỉ trong một nền tảng.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                variant="secondary" 
                className="border-slate-600 text-slate-700 hover:bg-slate-700 hover:text-white transition-all duration-300 group"
                onClick={() => setContent("LoginSection")}
                // onClick={() => navigate("/maintaining")}
              >
                Đăng nhập
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 transition-all duration-300 group"
                onClick={() => {setContent("RegistSection")}}
                // onClick={() => navigate("/maintaining")}
              >
                Đăng ký
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Feature Icons */}
            <div className="flex items-center space-x-8 pt-8">
              <div className="flex items-center space-x-2 text-slate-400">
                <Bot className="h-5 w-5" />
                <span className="text-sm">AI Agents</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <Brain className="h-5 w-5" />
                <span className="text-sm">Smart Analytics</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <Cpu className="h-5 w-5" />
                <span className="text-sm">Automation</span>
              </div>
            </div>
          </div>

          {/* Right Content - Illustration Area */}
          <div className="relatives sm:p-0 pb-10">
            <img 
              className="w-140 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-3xl p-8 backdrop-blur-sm border border-purple-500/20" 
              src="./landing_img01.jpg" alt="" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingContent;
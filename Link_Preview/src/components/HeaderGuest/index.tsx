import { Button } from "@/components/ui/button"

const HeaderGuest = (
  {setContent} : {setContent: React.Dispatch<React.SetStateAction<string>>}
) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a className="flex flex-rows items-center space-x-2 px-10">
            <img onClick={() => setContent("LandingContent")} className="w-40" src="./LEANDIX.png" alt="" />
          </a>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="hidden sm:block border-slate-600 text-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
              onClick={() => setContent("LoginSection")}
              // onClick={() => navigate("/maintaining")}
            >
              Đăng nhập
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 transition-all duration-300"
              onClick={() => setContent("RegistSection")}
              // onClick={() => navigate("/maintaining")}
            >
              Đăng ký
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderGuest;

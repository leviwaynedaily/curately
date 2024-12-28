import { Button } from "@/components/ui/button";
import { ArrowRight, Cloud, Image as GalleryIcon, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-[#E8F5E8] to-white overflow-hidden">
      {/* Main Content Section - combines hero and features */}
      <main className="flex-grow flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl w-full mx-auto flex flex-col items-center justify-center gap-8">
          {/* Logo and Hero Content */}
          <div className="text-center space-y-4 animate-fade-down">
            <div className="flex flex-col items-center gap-1">
              <img 
                src="/lovable-uploads/0920769a-f831-488a-86aa-99dc581e5339.png" 
                alt="Curately Logo" 
                className="h-16 w-auto sm:h-20 lg:h-24 object-contain"
              />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#2A6041] leading-tight">
                Your Digital Gallery,{" "}
                <span className="text-[#2A6041]">Beautifully Curated</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-[#4A6572] max-w-2xl mx-auto font-light">
                Showcase your products and collections with our elegant, secure, and
                customizable gallery platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
              <Button 
                asChild 
                size="default"
                className="bg-[#2A6041] text-white hover:bg-[#1E4933] transition-all duration-300 rounded-full px-4 py-2 text-sm sm:text-base w-full sm:w-auto max-w-[250px] mx-auto"
              >
                <Link to="/login" className="flex items-center justify-center">
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                disabled
                size="default"
                variant="secondary"
                className="bg-[#E8E8E8] border border-[#333333] text-[#333333] hover:bg-[#E8E8E8]/80 transition-all duration-300 rounded-full px-4 py-2 text-sm sm:text-base w-full sm:w-auto max-w-[250px] mx-auto opacity-75 cursor-not-allowed"
              >
                Sign Up (Coming Soon)
              </Button>
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl mx-auto px-4">
            <div className="p-4 bg-[#E8F5E8] backdrop-blur-sm rounded-xl border border-[#2A6041]/10 shadow-md hover:shadow-lg hover:bg-[#E8F5E8]/80 hover:border-[#2A6041]/20 hover:scale-102 transition-all duration-300">
              <Cloud className="h-8 w-8 text-[#2A6041] mb-2 mx-auto" />
              <h3 className="text-base sm:text-lg font-semibold mb-1 text-[#2A6041] text-center">
                Cloud-Based
              </h3>
              <p className="text-xs sm:text-sm text-[#4A6572] text-center leading-relaxed">
                Access your galleries anywhere, anytime.
              </p>
            </div>

            <div className="p-4 bg-[#E8F5E8] backdrop-blur-sm rounded-xl border border-[#2A6041]/10 shadow-md hover:shadow-lg hover:bg-[#E8F5E8]/80 hover:border-[#2A6041]/20 hover:scale-102 transition-all duration-300">
              <GalleryIcon className="h-8 w-8 text-[#2A6041] mb-2 mx-auto" />
              <h3 className="text-base sm:text-lg font-semibold mb-1 text-[#2A6041] text-center">
                Beautiful Display
              </h3>
              <p className="text-xs sm:text-sm text-[#4A6572] text-center leading-relaxed">
                Showcase your work with elegant layouts.
              </p>
            </div>

            <div className="p-4 bg-[#E8F5E8] backdrop-blur-sm rounded-xl border border-[#2A6041]/10 shadow-md hover:shadow-lg hover:bg-[#E8F5E8]/80 hover:border-[#2A6041]/20 hover:scale-102 transition-all duration-300">
              <Lock className="h-8 w-8 text-[#2A6041] mb-2 mx-auto" />
              <h3 className="text-base sm:text-lg font-semibold mb-1 text-[#2A6041] text-center">
                Secure Access
              </h3>
              <p className="text-xs sm:text-sm text-[#4A6572] text-center leading-relaxed">
                Control who sees your content.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#2A6041] py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-white">
            <Link to="#" className="hover:text-[#E8F5E8] transition-colors text-xs sm:text-sm">
              About
            </Link>
            <Link to="#" className="hover:text-[#E8F5E8] transition-colors text-xs sm:text-sm">
              Contact
            </Link>
            <Link to="#" className="hover:text-[#E8F5E8] transition-colors text-xs sm:text-sm">
              Privacy Policy
            </Link>
          </div>
          <div className="text-center mt-1 text-white/60 text-xs">
            © {new Date().getFullYear()} Curately. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
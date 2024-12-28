import { Button } from "@/components/ui/button";
import { ArrowRight, Cloud, Image as GalleryIcon, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-neutral to-white overflow-hidden">
      {/* Main Content Section - combines hero and features */}
      <main className="flex-grow flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl w-full mx-auto flex flex-col items-center justify-center gap-8">
          {/* Logo and Hero Content */}
          <div className="text-center space-y-4 animate-fade-down">
            <div className="flex flex-col items-center gap-1">
              <img 
                src="/lovable-uploads/2e1493f2-d9d7-4ff8-9114-4f21044df0df.png" 
                alt="Curately Logo" 
                className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 object-contain"
              />
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-accent">Curately</span>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary leading-tight">
                Your Digital Gallery,{" "}
                <span className="text-primary">Beautifully Curated</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate max-w-2xl mx-auto font-light">
                Showcase your products and collections with our elegant, secure, and
                customizable gallery platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
              <Button 
                asChild 
                size="default"
                className="bg-primary text-neutral hover:bg-accent hover:text-neutral transition-all duration-300 rounded-full px-4 py-2 text-sm sm:text-base w-full sm:w-auto max-w-[250px] mx-auto"
              >
                <Link to="/login" className="flex items-center justify-center">
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                disabled
                size="default"
                variant="secondary"
                className="bg-light border border-secondary text-secondary hover:bg-light/80 transition-all duration-300 rounded-full px-4 py-2 text-sm sm:text-base w-full sm:w-auto max-w-[250px] mx-auto opacity-75 cursor-not-allowed"
              >
                Sign Up (Coming Soon)
              </Button>
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl mx-auto px-4">
            <div className="p-4 bg-neutral/80 backdrop-blur-sm rounded-xl border border-secondary/10 shadow-md hover:shadow-lg hover:bg-light hover:scale-102 transition-all duration-300">
              <Cloud className="h-8 w-8 text-primary mb-2 mx-auto" />
              <h3 className="text-base sm:text-lg font-semibold mb-1 text-primary text-center">
                Cloud-Based
              </h3>
              <p className="text-xs sm:text-sm text-slate text-center leading-relaxed">
                Access your galleries anywhere, anytime.
              </p>
            </div>

            <div className="p-4 bg-neutral/80 backdrop-blur-sm rounded-xl border border-secondary/10 shadow-md hover:shadow-lg hover:bg-light hover:scale-102 transition-all duration-300">
              <GalleryIcon className="h-8 w-8 text-primary mb-2 mx-auto" />
              <h3 className="text-base sm:text-lg font-semibold mb-1 text-primary text-center">
                Beautiful Display
              </h3>
              <p className="text-xs sm:text-sm text-slate text-center leading-relaxed">
                Showcase your work with elegant layouts.
              </p>
            </div>

            <div className="p-4 bg-neutral/80 backdrop-blur-sm rounded-xl border border-secondary/10 shadow-md hover:shadow-lg hover:bg-light hover:scale-102 transition-all duration-300">
              <Lock className="h-8 w-8 text-primary mb-2 mx-auto" />
              <h3 className="text-base sm:text-lg font-semibold mb-1 text-primary text-center">
                Secure Access
              </h3>
              <p className="text-xs sm:text-sm text-slate text-center leading-relaxed">
                Control who sees your content.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-secondary py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-neutral">
            <Link to="#" className="hover:text-slate transition-colors text-xs sm:text-sm">
              About
            </Link>
            <Link to="#" className="hover:text-slate transition-colors text-xs sm:text-sm">
              Contact
            </Link>
            <Link to="#" className="hover:text-slate transition-colors text-xs sm:text-sm">
              Privacy Policy
            </Link>
          </div>
          <div className="text-center mt-1 text-neutral/60 text-xs">
            © {new Date().getFullYear()} Curately. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
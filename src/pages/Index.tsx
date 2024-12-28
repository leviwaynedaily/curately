import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Image as GalleryIcon, Cloud } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-primary/10 to-white overflow-hidden">
      <main className="flex-grow flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl w-full mx-auto flex flex-col items-center justify-center gap-12">
          {/* Logo and Hero Content */}
          <div className="text-center space-y-6 animate-fade-down">
            <div className="relative flex flex-col items-center">
              {/* Picture Frame Effect */}
              <div className="relative p-6 rounded-lg bg-gradient-to-tr from-accent/20 to-primary/10 shadow-xl border border-accent/30">
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-lg" />
                <div className="relative flex items-center justify-center gap-3">
                  <Lock 
                    className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-accent drop-shadow-md transition-all duration-300 hover:scale-110"
                  />
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                    Curately
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary leading-tight">
                Your Digital Gallery,{" "}
                <span className="text-accent">Beautifully Curated</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate/80 max-w-2xl mx-auto font-light">
                Showcase your products and collections with our elegant, secure, and
                customizable gallery platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button 
                asChild 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 rounded-full px-6 shadow-md hover:shadow-lg"
              >
                <Link to="/login" className="flex items-center justify-center">
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                disabled
                size="lg"
                variant="secondary"
                className="bg-white/80 border border-primary/20 text-primary hover:bg-white/60 transition-all duration-300 rounded-full px-6 opacity-75 cursor-not-allowed shadow-md"
              >
                Sign Up (Coming Soon)
              </Button>
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mx-auto px-4">
            <div className="p-6 glass-panel hover-card border-accent/20">
              <Cloud className="h-8 w-8 text-primary mb-3 mx-auto" />
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-primary text-center">
                Cloud-Based
              </h3>
              <p className="text-xs sm:text-sm text-slate/80 text-center leading-relaxed">
                Access your galleries anywhere, anytime.
              </p>
            </div>

            <div className="p-6 glass-panel hover-card border-accent/20">
              <GalleryIcon className="h-8 w-8 text-primary mb-3 mx-auto" />
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-primary text-center">
                Beautiful Display
              </h3>
              <p className="text-xs sm:text-sm text-slate/80 text-center leading-relaxed">
                Showcase your work with elegant layouts.
              </p>
            </div>

            <div className="p-6 glass-panel hover-card border-accent/20">
              <Lock className="h-8 w-8 text-primary mb-3 mx-auto" />
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-primary text-center">
                Secure Access
              </h3>
              <p className="text-xs sm:text-sm text-slate/80 text-center leading-relaxed">
                Control who sees your content.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-primary/5 py-4 px-4 sm:px-8 backdrop-blur-sm border-t border-primary/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 text-slate/80">
            <Link to="#" className="hover:text-primary transition-colors text-xs sm:text-sm">
              About
            </Link>
            <Link to="#" className="hover:text-primary transition-colors text-xs sm:text-sm">
              Contact
            </Link>
            <Link to="#" className="hover:text-primary transition-colors text-xs sm:text-sm">
              Privacy Policy
            </Link>
          </div>
          <div className="text-center mt-2 text-slate/60 text-xs">
            © {new Date().getFullYear()} Curately. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
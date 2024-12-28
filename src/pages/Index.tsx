import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Image as GalleryIcon, Cloud, Cannabis, Building2, Factory, Package2 } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-primary/5 via-primary/10 via-primary/5 to-neutral/80 overflow-hidden">
      <main className="flex-grow flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl w-full mx-auto flex flex-col items-center justify-center gap-12">
          {/* Logo and Hero Content */}
          <div className="text-center space-y-6 animate-fade-down">
            <div className="relative flex flex-col items-center">
              {/* Picture Frame Effect */}
              <div className="relative p-6 rounded-lg bg-gradient-to-tr from-accent/10 to-primary/5 shadow-md border border-accent/20">
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-lg" />
                <div className="relative flex items-center justify-center gap-3">
                  <Lock 
                    className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-accent/80 drop-shadow-sm transition-all duration-300 hover:scale-110"
                  />
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-accent/90 to-primary bg-clip-text text-transparent">
                    Curately
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary/90 leading-tight">
                Your Digital Gallery,{" "}
                <span className="text-accent/90">Beautifully Curated</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate/70 max-w-2xl mx-auto font-light">
                Showcase your products and collections with our elegant, secure, and
                customizable gallery platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button 
                asChild 
                size="lg"
                className="bg-primary/90 hover:bg-primary/80 text-primary-foreground transition-all duration-300 rounded-full px-6 shadow-sm hover:shadow-md"
              >
                <Link to="/login" className="flex items-center justify-center">
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                disabled
                size="lg"
                variant="secondary"
                className="bg-white/60 border border-primary/10 text-primary/80 hover:bg-white/50 transition-all duration-300 rounded-full px-6 opacity-75 cursor-not-allowed shadow-sm"
              >
                Sign Up (Coming Soon)
              </Button>
            </div>
          </div>

          {/* Industries Section - More Subtle */}
          <div className="w-full max-w-4xl mx-auto px-4">
            <h2 className="text-lg font-medium text-primary/80 mb-4 text-center">Industries We Serve</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-primary/5 hover:border-primary/10 transition-all duration-300 flex flex-col items-center group">
                <Cannabis className="h-6 w-6 text-primary/60 group-hover:text-primary/80 transition-colors mb-2" />
                <span className="text-sm font-medium text-slate/70 group-hover:text-slate/80">Cannabis</span>
              </div>
              <div className="p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-primary/5 hover:border-primary/10 transition-all duration-300 flex flex-col items-center group">
                <Building2 className="h-6 w-6 text-primary/60 group-hover:text-primary/80 transition-colors mb-2" />
                <span className="text-sm font-medium text-slate/70 group-hover:text-slate/80">Dispensaries</span>
              </div>
              <div className="p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-primary/5 hover:border-primary/10 transition-all duration-300 flex flex-col items-center group">
                <Factory className="h-6 w-6 text-primary/60 group-hover:text-primary/80 transition-colors mb-2" />
                <span className="text-sm font-medium text-slate/70 group-hover:text-slate/80">Producers</span>
              </div>
              <div className="p-4 rounded-lg bg-white/40 backdrop-blur-sm border border-primary/5 hover:border-primary/10 transition-all duration-300 flex flex-col items-center group">
                <Package2 className="h-6 w-6 text-primary/60 group-hover:text-primary/80 transition-colors mb-2" />
                <span className="text-sm font-medium text-slate/70 group-hover:text-slate/80">Products</span>
              </div>
            </div>
          </div>

          {/* Feature Cards Grid - Simplified */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl mx-auto px-4">
            <div className="p-5 rounded-lg bg-white/40 backdrop-blur-sm border border-primary/5 hover:border-primary/10 transition-all duration-300 group">
              <Cloud className="h-6 w-6 text-primary/60 group-hover:text-primary/80 transition-colors mb-2 mx-auto" />
              <h3 className="text-base font-medium mb-1 text-primary/80 text-center">
                Cloud-Based
              </h3>
              <p className="text-sm text-slate/60 text-center leading-relaxed">
                Access your galleries anywhere, anytime.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white/40 backdrop-blur-sm border border-primary/5 hover:border-primary/10 transition-all duration-300 group">
              <GalleryIcon className="h-6 w-6 text-primary/60 group-hover:text-primary/80 transition-colors mb-2 mx-auto" />
              <h3 className="text-base font-medium mb-1 text-primary/80 text-center">
                Beautiful Display
              </h3>
              <p className="text-sm text-slate/60 text-center leading-relaxed">
                Showcase your work with elegant layouts.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white/40 backdrop-blur-sm border border-primary/5 hover:border-primary/10 transition-all duration-300 group">
              <Lock className="h-6 w-6 text-primary/60 group-hover:text-primary/80 transition-colors mb-2 mx-auto" />
              <h3 className="text-base font-medium mb-1 text-primary/80 text-center">
                Secure Access
              </h3>
              <p className="text-sm text-slate/60 text-center leading-relaxed">
                Control who sees your content.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Simplified */}
      <footer className="w-full bg-white/5 py-4 px-4 sm:px-8 backdrop-blur-sm border-t border-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 text-slate/60">
            <Link to="#" className="hover:text-primary/70 transition-colors text-xs sm:text-sm">
              About
            </Link>
            <Link to="#" className="hover:text-primary/70 transition-colors text-xs sm:text-sm">
              Contact
            </Link>
            <Link to="#" className="hover:text-primary/70 transition-colors text-xs sm:text-sm">
              Privacy Policy
            </Link>
          </div>
          <div className="text-center mt-2 text-slate/50 text-xs">
            © {new Date().getFullYear()} Curately. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
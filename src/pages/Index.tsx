import { Button } from "@/components/ui/button";
import { ArrowRight, Cloud, Image as GalleryIcon, Lock, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-neutral to-white">
      {/* Hero Section */}
      <section className="w-full py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-neutral to-white flex-grow">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center justify-center min-h-[calc(100vh-20rem)]">
          <div className="text-center space-y-5 animate-fade-down w-full max-w-4xl">
            <div className="flex flex-col items-center gap-2">
              <LockKeyhole className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-accent" />
              <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-accent">Curately</span>
            </div>
            <div className="space-y-5">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary leading-tight mb-5">
                Your Digital Gallery,{" "}
                <span className="text-primary">Beautifully Curated</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate max-w-2xl mx-auto font-light leading-relaxed mb-7">
                Showcase your products and collections with our elegant, secure, and
                customizable gallery platform. Perfect for photographers, artists, and
                businesses.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-7">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-primary text-neutral hover:bg-accent hover:text-neutral hover:scale-105 transition-all duration-300 rounded-full px-4 sm:px-6 py-2 sm:py-4 text-sm sm:text-base w-full sm:w-auto max-w-[280px] mx-auto"
                >
                  <Link to="/login" className="flex items-center justify-center">
                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  disabled
                  size="lg"
                  variant="secondary"
                  className="bg-light border border-secondary text-secondary hover:bg-light/80 transition-all duration-300 rounded-full px-4 sm:px-6 py-2 sm:py-4 text-sm sm:text-base w-full sm:w-auto max-w-[280px] mx-auto opacity-75 cursor-not-allowed"
                >
                  Sign Up (Coming Soon)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-light">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary text-center mb-8">
            Why Choose Curately?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {/* Cloud Feature */}
            <div className="p-5 bg-neutral/80 backdrop-blur-sm rounded-xl border border-secondary/10 shadow-md hover:shadow-lg hover:bg-light hover:scale-102 transition-all duration-300 w-full max-w-[350px]">
              <Cloud className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-primary text-center">
                Cloud-Based
              </h3>
              <p className="text-xs sm:text-sm text-slate text-center leading-relaxed">
                Access your galleries anywhere, anytime. Your content is always
                secure and available.
              </p>
            </div>

            {/* Gallery Feature */}
            <div className="p-5 bg-neutral/80 backdrop-blur-sm rounded-xl border border-secondary/10 shadow-md hover:shadow-lg hover:bg-light hover:scale-102 transition-all duration-300 w-full max-w-[350px]">
              <GalleryIcon className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-primary text-center">
                Beautiful Display
              </h3>
              <p className="text-xs sm:text-sm text-slate text-center leading-relaxed">
                Showcase your work with elegant layouts and customizable themes.
              </p>
            </div>

            {/* Security Feature */}
            <div className="p-5 bg-neutral/80 backdrop-blur-sm rounded-xl border border-secondary/10 shadow-md hover:shadow-lg hover:bg-light hover:scale-102 transition-all duration-300 w-full max-w-[350px]">
              <Lock className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-primary text-center">
                Secure Access
              </h3>
              <p className="text-xs sm:text-sm text-slate text-center leading-relaxed">
                Control who sees your content with password protection and
                age verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-secondary py-6 sm:py-8 px-4 sm:px-8 mt-auto sticky bottom-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-neutral">
            <Link to="#" className="hover:text-slate transition-colors text-sm sm:text-base">
              About
            </Link>
            <Link to="#" className="hover:text-slate transition-colors text-sm sm:text-base">
              Contact
            </Link>
            <Link to="#" className="hover:text-slate transition-colors text-sm sm:text-base">
              Privacy Policy
            </Link>
          </div>
          <div className="text-center mt-4 text-neutral/60 text-xs sm:text-sm">
            © {new Date().getFullYear()} Curately. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
import { Button } from "@/components/ui/button";
import { ArrowRight, Cloud, Image as GalleryIcon, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral to-white">
      {/* Hero Section */}
      <section className="py-10 px-8 bg-gradient-to-b from-neutral to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 animate-fade-down">
            <div className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-2">
              <span className="text-accent">Curately</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-secondary leading-tight mb-2">
              Your Digital Gallery,{" "}
              <span className="text-primary">Beautifully Curated</span>
            </h1>
            <p className="text-base md:text-lg text-slate max-w-2xl mx-auto font-light leading-relaxed mb-5">
              Showcase your products and collections with our elegant, secure, and
              customizable gallery platform. Perfect for photographers, artists, and
              businesses.
            </p>
            <div className="flex justify-center pt-5">
              <Button 
                asChild 
                size="lg" 
                className="bg-primary text-neutral hover:bg-accent hover:text-neutral hover:scale-105 transition-all duration-300 rounded-full px-6 py-4 text-base"
              >
                <Link to="/login">
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 px-8 bg-gradient-to-b from-white to-light">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-8">
            Why Choose Curately?
          </h2>
          <div className="grid md:grid-cols-3 gap-3">
            {/* Cloud Feature */}
            <div className="p-6 bg-neutral rounded-xl border border-secondary/10 shadow-md hover:shadow-lg hover:bg-light hover:scale-102 transition-all duration-300 max-w-[280px] mx-auto w-full">
              <Cloud className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-secondary text-center">
                Cloud-Based
              </h3>
              <p className="text-sm text-slate text-center leading-relaxed">
                Access your galleries anywhere, anytime. Your content is always
                secure and available.
              </p>
            </div>

            {/* Gallery Feature */}
            <div className="p-6 bg-neutral rounded-xl border border-secondary/10 shadow-md hover:shadow-lg hover:bg-light hover:scale-102 transition-all duration-300 max-w-[280px] mx-auto w-full">
              <GalleryIcon className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-secondary text-center">
                Beautiful Display
              </h3>
              <p className="text-sm text-slate text-center leading-relaxed">
                Showcase your work with elegant layouts and customizable themes.
              </p>
            </div>

            {/* Security Feature */}
            <div className="p-6 bg-neutral rounded-xl border border-secondary/10 shadow-md hover:shadow-lg hover:bg-light hover:scale-102 transition-all duration-300 max-w-[280px] mx-auto w-full">
              <Lock className="h-12 w-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-secondary text-center">
                Secure Access
              </h3>
              <p className="text-sm text-slate text-center leading-relaxed">
                Control who sees your content with password protection and
                age verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary py-8 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-neutral">
            <Link to="#" className="hover:text-slate transition-colors">
              About
            </Link>
            <Link to="#" className="hover:text-slate transition-colors">
              Contact
            </Link>
            <Link to="#" className="hover:text-slate transition-colors">
              Privacy Policy
            </Link>
          </div>
          <div className="text-center mt-4 text-neutral/60 text-sm">
            © {new Date().getFullYear()} Curately. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
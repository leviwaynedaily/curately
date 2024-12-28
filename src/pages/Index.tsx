import { Button } from "@/components/ui/button";
import { ArrowRight, Cloud, Image, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-neutral">
      {/* Hero Section */}
      <section className="relative py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 animate-fade-down">
            <div className="text-4xl md:text-6xl font-bold text-primary tracking-tight">
              <span className="text-accent">Curately</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-secondary">
              Your Digital Gallery,{" "}
              <span className="text-primary">Beautifully Curated</span>
            </h1>
            <p className="text-xl text-slate max-w-2xl mx-auto">
              Showcase your products and collections with our elegant, secure, and
              customizable gallery platform. Perfect for photographers, artists, and
              businesses.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="bg-accent text-secondary hover:bg-accent/90">
                <Link to="/login">
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 bg-light">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">
            Why Choose Curately?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-neutral rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <Cloud className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-secondary">Cloud-Based</h3>
              <p className="text-slate">
                Access your galleries anywhere, anytime. Your content is always
                secure and available.
              </p>
            </div>
            <div className="p-6 bg-neutral rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <Image className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-secondary">Beautiful Display</h3>
              <p className="text-slate">
                Showcase your work with elegant layouts and customizable themes.
              </p>
            </div>
            <div className="p-6 bg-neutral rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <Lock className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-secondary">Secure Access</h3>
              <p className="text-slate">
                Control who sees your content with password protection and
                age verification.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
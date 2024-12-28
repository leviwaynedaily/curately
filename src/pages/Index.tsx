import { Button } from "@/components/ui/button";
import { ArrowRight, Cloud, Image, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="relative py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 animate-fade-down">
            <img
              src="/curately-logo.png"
              alt="Curately"
              className="h-20 mx-auto mb-8"
            />
            <h1 className="text-5xl md:text-6xl font-bold text-secondary">
              Your Digital Gallery,{" "}
              <span className="text-accent">Beautifully Curated</span>
            </h1>
            <p className="text-xl text-secondary/80 max-w-2xl mx-auto">
              Showcase your products and collections with our elegant, secure, and
              customizable gallery platform. Perfect for photographers, artists, and
              businesses.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="bg-accent text-primary hover:bg-accent/90">
                <Link to="/login">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">
            Why Choose Curately?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <Cloud className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">Cloud-Based</h3>
              <p className="text-gray-600">
                Access your galleries anywhere, anytime. Your content is always
                secure and available.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <Image className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">Beautiful Display</h3>
              <p className="text-gray-600">
                Showcase your work with elegant layouts and customizable themes.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <Lock className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
              <p className="text-gray-600">
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
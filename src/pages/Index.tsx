import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Image as GalleryIcon, Cloud, Cannabis, Building2, Factory, Package2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: storefronts } = useQuery({
    queryKey: ["public-storefronts"],
    queryFn: async () => {
      console.log("Fetching public storefronts");
      const { data, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("status", "active");
      
      if (error) throw error;
      console.log("Fetched storefronts:", data);
      return data;
    },
  });

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-primary/10 via-primary/20 to-neutral/90 overflow-hidden">
      <main className="flex-grow flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl w-full mx-auto flex flex-col items-center justify-center gap-12">
          {/* Logo and Hero Content */}
          <div className="text-center space-y-6">
            <div className="relative flex flex-col items-center bounce-in" style={{ animationDelay: '0.1s' }}>
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
            
            <div className="space-y-4 bounce-in" style={{ animationDelay: '0.3s' }}>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary/90 leading-tight">
                Your Digital Gallery,{" "}
                <span className="text-accent/90">Beautifully Curated</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate/70 max-w-2xl mx-auto font-light">
                Showcase your products and collections with our elegant, secure, and
                customizable gallery platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 bounce-in" style={{ animationDelay: '0.5s' }}>
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

          {/* Featured Storefronts Grid */}
          {storefronts && storefronts.length > 0 && (
            <div className="w-full max-w-6xl mx-auto px-4 space-y-8 bounce-in" style={{ animationDelay: '0.7s' }}>
              <h2 className="text-2xl font-semibold text-center text-primary/90">Featured Galleries</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {storefronts.map((storefront) => (
                  <Link
                    key={storefront.id}
                    to={`/storefront/${storefront.id}`}
                    className="group"
                  >
                    <div className="aspect-square bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 p-4 flex items-center justify-center">
                      {storefront.site_logo ? (
                        <img
                          src={supabase.storage.from("gallery_images").getPublicUrl(storefront.site_logo).data.publicUrl}
                          alt={storefront.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-lg font-medium text-primary/80 text-center group-hover:text-primary transition-colors">
                          {storefront.name}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Industries Section - Icons Only */}
          <div className="w-full max-w-4xl mx-auto px-4">
            <div className="flex justify-center gap-12 flex-wrap">
              <Cannabis className="h-12 w-12 text-primary/60 hover:text-primary transition-all duration-300 hover:scale-110 cursor-pointer bounce-in" style={{ animationDelay: '0.7s' }} />
              <Building2 className="h-12 w-12 text-primary/60 hover:text-primary transition-all duration-300 hover:scale-110 cursor-pointer bounce-in" style={{ animationDelay: '0.8s' }} />
              <Factory className="h-12 w-12 text-primary/60 hover:text-primary transition-all duration-300 hover:scale-110 cursor-pointer bounce-in" style={{ animationDelay: '0.9s' }} />
              <Package2 className="h-12 w-12 text-primary/60 hover:text-primary transition-all duration-300 hover:scale-110 cursor-pointer bounce-in" style={{ animationDelay: '1s' }} />
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl mx-auto px-4">
            <div className="p-5 rounded-lg bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group bounce-in" style={{ animationDelay: '1.1s' }}>
              <Cloud className="h-6 w-6 text-primary/80 group-hover:text-primary transition-colors mb-2 mx-auto" />
              <h3 className="text-base font-medium mb-1 text-primary text-center">
                Cloud-Based
              </h3>
              <p className="text-sm text-slate text-center leading-relaxed">
                Access your galleries anywhere, anytime.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group bounce-in" style={{ animationDelay: '1.2s' }}>
              <GalleryIcon className="h-6 w-6 text-primary/80 group-hover:text-primary transition-colors mb-2 mx-auto" />
              <h3 className="text-base font-medium mb-1 text-primary text-center">
                Beautiful Display
              </h3>
              <p className="text-sm text-slate text-center leading-relaxed">
                Showcase your work with elegant layouts.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group bounce-in" style={{ animationDelay: '1.3s' }}>
              <Lock className="h-6 w-6 text-primary/80 group-hover:text-primary transition-colors mb-2 mx-auto" />
              <h3 className="text-base font-medium mb-1 text-primary text-center">
                Secure Access
              </h3>
              <p className="text-sm text-slate text-center leading-relaxed">
                Control who sees your content.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white/5 py-4 px-4 sm:px-8 backdrop-blur-sm border-t border-primary/5 bounce-in" style={{ animationDelay: '1.4s' }}>
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
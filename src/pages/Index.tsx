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
    <div className="h-screen flex flex-col bg-gradient-to-b from-primary/10 via-primary/20 to-neutral/90">
      <main className="flex-grow flex flex-col justify-center items-center px-2 sm:px-4 lg:px-6 py-4">
        <div className="max-w-6xl w-full mx-auto flex flex-col items-center justify-center gap-6">
          {/* Logo and Hero Content */}
          <div className="text-center space-y-4">
            <div className="relative flex flex-col items-center bounce-in" style={{ animationDelay: '0.1s' }}>
              <div className="relative p-4 rounded-lg bg-gradient-to-tr from-accent/10 to-primary/5 shadow-md border border-accent/20">
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-lg" />
                <div className="relative flex items-center justify-center gap-2">
                  <Lock 
                    className="h-6 w-6 sm:h-8 sm:w-8 text-accent/80 drop-shadow-sm transition-all duration-300 hover:scale-110"
                  />
                  <span className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-accent/90 to-primary bg-clip-text text-transparent">
                    Curately
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 bounce-in" style={{ animationDelay: '0.3s' }}>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary/90 leading-tight">
                Your Digital Gallery,{" "}
                <span className="text-accent/90">Beautifully Curated</span>
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-slate/70 max-w-xl mx-auto font-light">
                Showcase your products and collections with our elegant, secure, and
                customizable gallery platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3 bounce-in" style={{ animationDelay: '0.5s' }}>
              <Button 
                asChild 
                size="sm"
                className="bg-primary/90 hover:bg-primary/80 text-primary-foreground transition-all duration-300 rounded-full px-4 shadow-sm hover:shadow-md"
              >
                <Link to="/login" className="flex items-center justify-center">
                  Sign In <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
              <Button
                disabled
                size="sm"
                variant="secondary"
                className="bg-white/60 border border-primary/10 text-primary/80 hover:bg-white/50 transition-all duration-300 rounded-full px-4 opacity-75 cursor-not-allowed shadow-sm"
              >
                Sign Up (Coming Soon)
              </Button>
            </div>
          </div>

          {/* Featured Storefronts Grid */}
          {storefronts && storefronts.length > 0 && (
            <div className="w-full max-w-4xl mx-auto px-2 space-y-3 bounce-in" style={{ animationDelay: '0.7s' }}>
              <h2 className="text-xl font-semibold text-center text-primary/90">Featured Galleries</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 place-items-center">
                {storefronts.map((storefront) => (
                  <Link
                    key={storefront.id}
                    to={`/storefront/${storefront.id}`}
                    className="group w-full flex items-center justify-center"
                  >
                    <div className="aspect-square w-full max-w-[200px] bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 p-4 flex items-center justify-center mx-auto">
                      {storefront.site_logo ? (
                        <img
                          src={supabase.storage.from("gallery_images").getPublicUrl(storefront.site_logo).data.publicUrl}
                          alt={storefront.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-sm font-medium text-primary/80 text-center group-hover:text-primary transition-colors">
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
          <div className="w-full max-w-3xl mx-auto px-2">
            <div className="flex justify-center gap-6 sm:gap-8 flex-wrap">
              <Cannabis className="h-8 w-8 sm:h-10 sm:w-10 text-primary/60 hover:text-primary transition-all duration-300 hover:scale-110 cursor-pointer bounce-in" style={{ animationDelay: '0.7s' }} />
              <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-primary/60 hover:text-primary transition-all duration-300 hover:scale-110 cursor-pointer bounce-in" style={{ animationDelay: '0.8s' }} />
              <Factory className="h-8 w-8 sm:h-10 sm:w-10 text-primary/60 hover:text-primary transition-all duration-300 hover:scale-110 cursor-pointer bounce-in" style={{ animationDelay: '0.9s' }} />
              <Package2 className="h-8 w-8 sm:h-10 sm:w-10 text-primary/60 hover:text-primary transition-all duration-300 hover:scale-110 cursor-pointer bounce-in" style={{ animationDelay: '1s' }} />
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl mx-auto px-2">
            <div className="p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group bounce-in" style={{ animationDelay: '1.1s' }}>
              <Cloud className="h-5 w-5 text-primary/80 group-hover:text-primary transition-colors mb-1 mx-auto" />
              <h3 className="text-sm font-medium mb-1 text-primary text-center">
                Cloud-Based
              </h3>
              <p className="text-xs text-slate text-center leading-relaxed">
                Access your galleries anywhere, anytime.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group bounce-in" style={{ animationDelay: '1.2s' }}>
              <GalleryIcon className="h-5 w-5 text-primary/80 group-hover:text-primary transition-colors mb-1 mx-auto" />
              <h3 className="text-sm font-medium mb-1 text-primary text-center">
                Beautiful Display
              </h3>
              <p className="text-xs text-slate text-center leading-relaxed">
                Showcase your work with elegant layouts.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group bounce-in" style={{ animationDelay: '1.3s' }}>
              <Lock className="h-5 w-5 text-primary/80 group-hover:text-primary transition-colors mb-1 mx-auto" />
              <h3 className="text-sm font-medium mb-1 text-primary text-center">
                Secure Access
              </h3>
              <p className="text-xs text-slate text-center leading-relaxed">
                Control who sees your content.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white/5 py-2 px-2 sm:px-4 backdrop-blur-sm border-t border-primary/5 bounce-in" style={{ animationDelay: '1.4s' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-slate/60">
            <Link to="#" className="hover:text-primary/70 transition-colors text-xs">
              About
            </Link>
            <Link to="#" className="hover:text-primary/70 transition-colors text-xs">
              Contact
            </Link>
            <Link to="#" className="hover:text-primary/70 transition-colors text-xs">
              Privacy Policy
            </Link>
          </div>
          <div className="text-center mt-1 text-slate/50 text-xs">
            © {new Date().getFullYear()} Curately. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
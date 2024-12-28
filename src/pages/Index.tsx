import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import HomeHero from "@/components/home/HomeHero";
import StorefrontGrid from "@/components/home/StorefrontGrid";
import IndustryIcons from "@/components/home/IndustryIcons";
import FeatureCards from "@/components/home/FeatureCards";

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/10 via-primary/20 to-neutral/90">
      {/* Professional Header */}
      <header className="w-full py-4 px-6 bg-white/80 backdrop-blur-sm border-b border-primary/10 fixed top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-accent/80" />
            <span className="text-lg font-bold bg-gradient-to-r from-accent/90 to-primary bg-clip-text text-transparent">
              Curately
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              asChild 
              variant="ghost"
              size="sm"
              className="text-primary/80 hover:text-primary hover:bg-primary/5"
            >
              <Link to="/login">Login</Link>
            </Button>
            <Button
              size="sm"
              className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 rounded-full px-4 shadow-sm hover:shadow-md"
              disabled
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <div className="max-w-6xl w-full mx-auto flex flex-col items-center justify-center gap-12 sm:gap-16 lg:gap-20">
          <HomeHero />
          <StorefrontGrid storefronts={storefronts} />
          <IndustryIcons />
          <FeatureCards />
        </div>
      </main>

      <footer className="w-full bg-white/5 py-4 px-4 sm:px-6 backdrop-blur-sm border-t border-primary/5 bounce-in" style={{ animationDelay: '1.4s' }}>
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
          <div className="text-center mt-2 text-slate/50 text-xs">
            © {new Date().getFullYear()} Curately. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
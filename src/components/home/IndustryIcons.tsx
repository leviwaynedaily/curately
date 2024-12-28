import { Cannabis, Building2, Factory, Package2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const IndustryIcons = () => {
  const { toast } = useToast();

  const handleIconClick = (industry: string) => {
    toast({
      title: `${industry} Industry`,
      description: `Discover how Curately can help your ${industry.toLowerCase()} business grow.`,
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-2">
      <div className="flex justify-center gap-6 sm:gap-8 flex-wrap">
        <div 
          onClick={() => handleIconClick("Cannabis")}
          className="group cursor-pointer p-4 rounded-lg hover:bg-white/20 transition-all duration-300"
        >
          <Cannabis className="h-8 w-8 sm:h-10 sm:w-10 text-primary/60 group-hover:text-primary transition-all duration-300 group-hover:scale-110 bounce-in" style={{ animationDelay: '0.7s' }} />
        </div>
        <div 
          onClick={() => handleIconClick("Real Estate")}
          className="group cursor-pointer p-4 rounded-lg hover:bg-white/20 transition-all duration-300"
        >
          <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-primary/60 group-hover:text-primary transition-all duration-300 group-hover:scale-110 bounce-in" style={{ animationDelay: '0.8s' }} />
        </div>
        <div 
          onClick={() => handleIconClick("Manufacturing")}
          className="group cursor-pointer p-4 rounded-lg hover:bg-white/20 transition-all duration-300"
        >
          <Factory className="h-8 w-8 sm:h-10 sm:w-10 text-primary/60 group-hover:text-primary transition-all duration-300 group-hover:scale-110 bounce-in" style={{ animationDelay: '0.9s' }} />
        </div>
        <div 
          onClick={() => handleIconClick("Retail")}
          className="group cursor-pointer p-4 rounded-lg hover:bg-white/20 transition-all duration-300"
        >
          <Package2 className="h-8 w-8 sm:h-10 sm:w-10 text-primary/60 group-hover:text-primary transition-all duration-300 group-hover:scale-110 bounce-in" style={{ animationDelay: '1s' }} />
        </div>
      </div>
    </div>
  );
};

export default IndustryIcons;
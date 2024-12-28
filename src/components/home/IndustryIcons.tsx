import { Cannabis, Building2, Factory, Package2 } from "lucide-react";

const IndustryIcons = () => {
  return (
    <div className="w-full max-w-3xl mx-auto px-2">
      <div className="flex justify-center gap-6 sm:gap-8 flex-wrap">
        <Cannabis className="h-8 w-8 sm:h-10 sm:w-10 text-primary/60 hover:text-primary transition-all duration-300 hover:scale-110 cursor-pointer bounce-in" style={{ animationDelay: '0.7s' }} />
        <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-primary/60 hover:text-primary transition-all duration-300 hover:scale-110 cursor-pointer bounce-in" style={{ animationDelay: '0.8s' }} />
        <Factory className="h-8 w-8 sm:h-10 sm:w-10 text-primary/60 hover:text-primary transition-all duration-300 hover:scale-110 cursor-pointer bounce-in" style={{ animationDelay: '0.9s' }} />
        <Package2 className="h-8 w-8 sm:h-10 sm:w-10 text-primary/60 hover:text-primary transition-all duration-300 hover:scale-110 cursor-pointer bounce-in" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default IndustryIcons;
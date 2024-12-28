import { Cloud, Image as GalleryIcon, Lock } from "lucide-react";

const FeatureCards = () => {
  return (
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
  );
};

export default FeatureCards;
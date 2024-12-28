import { Cloud, Image as GalleryIcon, Lock } from "lucide-react";

const FeatureCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl mx-auto px-2">
      <div className="p-6 rounded-lg bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group bounce-in hover:-translate-y-1" style={{ animationDelay: '1.1s' }}>
        <Cloud className="h-8 w-8 text-primary/80 group-hover:text-primary transition-colors mb-3 mx-auto group-hover:scale-110 transform duration-300" />
        <h3 className="text-base font-medium mb-2 text-primary text-center">
          Cloud-Based
        </h3>
        <p className="text-sm text-slate text-center leading-relaxed">
          Access your galleries anywhere, anytime with secure cloud storage.
        </p>
      </div>

      <div className="p-6 rounded-lg bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group bounce-in hover:-translate-y-1" style={{ animationDelay: '1.2s' }}>
        <GalleryIcon className="h-8 w-8 text-primary/80 group-hover:text-primary transition-colors mb-3 mx-auto group-hover:scale-110 transform duration-300" />
        <h3 className="text-base font-medium mb-2 text-primary text-center">
          Beautiful Display
        </h3>
        <p className="text-sm text-slate text-center leading-relaxed">
          Showcase your work with elegant, customizable layouts.
        </p>
      </div>

      <div className="p-6 rounded-lg bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group bounce-in hover:-translate-y-1" style={{ animationDelay: '1.3s' }}>
        <Lock className="h-8 w-8 text-primary/80 group-hover:text-primary transition-colors mb-3 mx-auto group-hover:scale-110 transform duration-300" />
        <h3 className="text-base font-medium mb-2 text-primary text-center">
          Secure Access
        </h3>
        <p className="text-sm text-slate text-center leading-relaxed">
          Control who sees your content with advanced security features.
        </p>
      </div>
    </div>
  );
};

export default FeatureCards;
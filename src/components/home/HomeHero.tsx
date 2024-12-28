import { Lock } from "lucide-react";

const HomeHero = () => {
  return (
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
    </div>
  );
};

export default HomeHero;
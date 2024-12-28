const HomeHero = () => {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4 bounce-in" style={{ animationDelay: '0.3s' }}>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary/90 leading-tight">
          Your Digital Gallery,{" "}
          <span className="text-accent/90">Beautifully Curated</span>
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-slate/70 max-w-2xl mx-auto font-light">
          Showcase your products and collections with our elegant, secure, and
          customizable gallery platform.
        </p>
      </div>
    </div>
  );
};

export default HomeHero;
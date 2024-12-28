import { useEffect, useState } from "react";

const ParallaxBackground = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <div
        className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/20 to-neutral/90"
        style={{
          transform: `translateY(${offset * 0.5}px)`,
          transition: "transform 0.1s ease-out",
        }}
      />
    </div>
  );
};

export default ParallaxBackground;
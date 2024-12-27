import { useState, useEffect } from "react";
import { AgeVerification } from "@/components/AgeVerification";
import { PasswordProtection } from "@/components/PasswordProtection";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

const TENANT_ID = "demo"; // This will be dynamic in the full implementation

const Index = () => {
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ageVerified = localStorage.getItem("age-verified") === "true";
    const authenticated = localStorage.getItem(`gallery-${TENANT_ID}-auth`) === "true";
    
    setIsAgeVerified(ageVerified);
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="animate-pulse text-secondary">Loading...</div>
      </div>
    );
  }

  if (!isAgeVerified) {
    return <AgeVerification onVerified={() => setIsAgeVerified(true)} />;
  }

  if (!isAuthenticated) {
    return (
      <PasswordProtection
        tenantId={TENANT_ID}
        onAuthenticated={() => setIsAuthenticated(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-primary text-secondary p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 animate-fade-down">Galleries</h1>
        <GalleryGrid />
      </div>
    </div>
  );
};

export default Index;
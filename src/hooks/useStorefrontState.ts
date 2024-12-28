import { useState, useEffect } from "react";

export const useStorefrontState = (storefrontId: string | undefined) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (storefrontId) {
      const ageVerified = localStorage.getItem("age-verified") === "true";
      const authenticated = localStorage.getItem(`gallery-${storefrontId}-auth`) === "true";
      console.log("Checking verification state:", { ageVerified, authenticated, storefrontId });
      setIsVerified(ageVerified && authenticated);
      setIsLoading(false);
    }
  }, [storefrontId]);

  const handleVerified = () => {
    console.log("Handling verification success");
    localStorage.setItem("age-verified", "true");
    localStorage.setItem(`gallery-${storefrontId}-auth`, "true");
    setIsVerified(true);
  };

  const resetVerification = () => {
    console.log("Resetting verification state");
    localStorage.removeItem("age-verified");
    localStorage.removeItem(`gallery-${storefrontId}-auth`);
    setIsVerified(false);
  };

  return {
    isVerified,
    isLoading,
    handleVerified,
    resetVerification,
  };
};
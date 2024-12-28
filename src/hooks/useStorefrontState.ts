import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useStorefrontState = (storefrontId: string | undefined) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ageVerified = localStorage.getItem("age-verified") === "true";
    const authenticated = localStorage.getItem(`gallery-${storefrontId}-auth`) === "true";
    setIsVerified(ageVerified && authenticated);
    setIsLoading(false);
  }, [storefrontId]);

  const handleVerified = () => {
    localStorage.setItem("age-verified", "true");
    localStorage.setItem(`gallery-${storefrontId}-auth`, "true");
    setIsVerified(true);
  };

  return {
    isVerified,
    isLoading,
    handleVerified,
  };
};
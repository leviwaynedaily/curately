import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AgeVerificationForm } from "./age-verification/AgeVerificationForm";
import { AgeVerificationLogo } from "./age-verification/AgeVerificationLogo";

type AgeVerificationProps = {
  onVerified: () => void;
  tenantId: string;
  logo?: string;
};

export const AgeVerification = ({ onVerified, tenantId }: AgeVerificationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: storefront } = useQuery({
    queryKey: ["storefront-verification", tenantId],
    queryFn: async () => {
      console.log("Fetching storefront verification settings for ID:", tenantId);
      const { data, error } = await supabase
        .from("storefronts")
        .select(`
          logo,
          heading_text,
          subheading_text,
          age_verification_text,
          button_text,
          primary_color,
          secondary_color,
          primary_font_color,
          secondary_font_color,
          accent_font_color,
          password_required,
          password
        `)
        .eq("id", tenantId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching storefront verification settings:", error);
        throw error;
      }

      console.log("Storefront verification settings:", data);
      return data;
    },
  });

  const handleVerification = async (password?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (storefront?.password_required && storefront.password) {
        if (!password) {
          setError("Password is required");
          return;
        }
        
        if (password !== storefront.password) {
          setError("Incorrect password");
          return;
        }
      }
      
      localStorage.setItem("age-verified", "true");
      onVerified();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="absolute inset-0 backdrop-blur-md bg-black/30" />
      
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 space-y-8">
          {storefront?.logo && <AgeVerificationLogo logo={storefront.logo} />}
          
          <AgeVerificationForm
            isLoading={isLoading}
            onVerify={handleVerification}
            headingText={storefront?.heading_text || "Age Verification Required"}
            subheadingText={storefront?.subheading_text || "This website contains age-restricted content. By entering, you accept our terms and confirm your legal age to view such content."}
            verificationText={storefront?.age_verification_text || "I confirm that I am 21 years of age or older and agree to the Terms of Service and Privacy Policy."}
            buttonText={storefront?.button_text || "Enter Site"}
            accentColor={storefront?.accent_font_color || '#8B5CF6'}
            passwordRequired={storefront?.password_required || false}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};
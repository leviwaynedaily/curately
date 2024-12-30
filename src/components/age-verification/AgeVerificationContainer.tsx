import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AgeVerificationForm } from "./AgeVerificationForm";
import { AgeVerificationLogo } from "./AgeVerificationLogo";

interface AgeVerificationContainerProps {
  onVerified: () => void;
  id: string;
  logo?: string | null;
  verificationText?: string | null;
  buttonText?: string | null;
  error?: string | null;
  onError?: (error: string | null) => void;
}

export const AgeVerificationContainer = ({
  onVerified,
  id,
  logo,
  verificationText,
  buttonText,
  error: initialError,
  onError,
}: AgeVerificationContainerProps) => {
  const [error, setError] = useState<string | null>(initialError || null);

  const { data: storefront, isLoading } = useQuery({
    queryKey: ["storefronts", id],
    queryFn: async () => {
      console.log("Fetching storefront verification settings:", id);
      const { data, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching storefront:", error);
        throw error;
      }

      console.log("Storefront verification settings:", {
        age_verification_enabled: data.age_verification_enabled,
        password_required: data.password_required,
        password: data.password
      });
      
      return data;
    },
  });

  const handleVerify = (password?: string, ageVerified?: boolean) => {
    console.log("Verifying access with:", {
      passwordRequired: storefront?.password_required,
      passwordProvided: !!password,
      ageVerificationEnabled: storefront?.age_verification_enabled,
      ageVerified
    });

    // Check age verification if enabled
    if (storefront?.age_verification_enabled && !ageVerified) {
      const errorMessage = "Please confirm your age to continue";
      setError(errorMessage);
      onError?.(errorMessage);
      return;
    }

    // Check password if required
    if (storefront?.password_required && password !== storefront?.password) {
      const errorMessage = "Incorrect password";
      setError(errorMessage);
      onError?.(errorMessage);
      return;
    }

    setError(null);
    onError?.(null);
    onVerified();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!storefront) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 backdrop-blur-md"
        style={{
          backgroundColor: storefront?.primary_color ? `${storefront.primary_color}40` : 'rgba(0, 0, 0, 0.3)'
        }}
      />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
          {logo && <AgeVerificationLogo logo={logo} />}
          
          <AgeVerificationForm
            isLoading={isLoading}
            onVerify={handleVerify}
            headingText={storefront?.heading_text || "Verification Required"}
            subheadingText={storefront?.subheading_text || ""}
            verificationText={verificationText || storefront?.age_verification_text || ""}
            buttonText={buttonText || storefront?.button_text || "Enter"}
            accentColor={storefront?.accent_color}
            passwordRequired={storefront?.password_required}
            ageVerificationEnabled={storefront?.age_verification_enabled}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};
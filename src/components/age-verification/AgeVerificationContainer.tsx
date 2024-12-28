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
}

export const AgeVerificationContainer = ({
  onVerified,
  id,
  logo,
  verificationText,
  buttonText,
}: AgeVerificationContainerProps) => {
  const [error, setError] = useState<string | null>(null);

  const { data: storefront, isLoading } = useQuery({
    queryKey: ["storefronts", id],
    queryFn: async () => {
      console.log("Fetching storefront:", id);
      const { data, error } = await supabase
        .from("storefronts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching storefront:", error);
        throw error;
      }

      console.log("Storefront data:", data);
      return data;
    },
  });

  const handleVerify = (password?: string) => {
    if (storefront?.password_required && password !== storefront?.password) {
      setError("Incorrect password");
      return;
    }
    onVerified();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Semi-transparent overlay with blur effect */}
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
            headingText={storefront?.heading_text || "Age Verification Required"}
            subheadingText={storefront?.subheading_text || ""}
            verificationText={verificationText || storefront?.age_verification_text || ""}
            buttonText={buttonText || storefront?.button_text || "Enter"}
            accentColor={storefront?.accent_color}
            passwordRequired={storefront?.password_required}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};
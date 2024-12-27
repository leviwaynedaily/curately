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

  const { data: gallery } = useQuery({
    queryKey: ["gallery-verification", tenantId],
    queryFn: async () => {
      console.log("Fetching gallery verification settings for ID:", tenantId);
      const { data, error } = await supabase
        .from("galleries")
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
          accent_font_color
        `)
        .eq("id", tenantId)
        .single();

      if (error) {
        console.error("Error fetching gallery verification settings:", error);
        throw error;
      }

      console.log("Gallery verification settings:", data);
      return data;
    },
  });

  const handleVerification = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem("age-verified", "true");
      onVerified();
    } finally {
      setIsLoading(false);
    }
  };

  const containerStyle = {
    backgroundColor: gallery?.primary_color || '#141413',
    color: gallery?.primary_font_color || '#E6E4DD',
  };

  const contentStyle = {
    backgroundColor: gallery?.secondary_color || 'rgba(255, 255, 255, 0.8)',
    color: gallery?.secondary_font_color || '#000000',
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-sm z-50"
      style={containerStyle}
    >
      <div 
        className="w-full max-w-md space-y-8 backdrop-blur-sm p-6 rounded-lg shadow-xl"
        style={contentStyle}
      >
        {gallery?.logo && <AgeVerificationLogo logo={gallery.logo} />}
        
        <AgeVerificationForm
          isLoading={isLoading}
          onVerify={handleVerification}
          headingText={gallery?.heading_text || "Age Verification Required"}
          subheadingText={gallery?.subheading_text || "This website contains age-restricted content. By entering, you accept our terms and confirm your legal age to view such content."}
          verificationText={gallery?.age_verification_text || "I confirm that I am 21 years of age or older and agree to the Terms of Service and Privacy Policy."}
          buttonText={gallery?.button_text || "Enter Site"}
          accentColor={gallery?.accent_font_color || '#8B5CF6'}
        />
      </div>
    </div>
  );
};
import { supabase } from "@/integrations/supabase/client";

interface AgeVerificationLogoProps {
  logo?: string;
}

export const AgeVerificationLogo = ({ logo }: AgeVerificationLogoProps) => {
  if (!logo) {
    console.log("No logo provided to AgeVerificationLogo");
    return null;
  }
  
  const logoUrl = supabase.storage.from("gallery_images").getPublicUrl(logo).data.publicUrl;
  console.log("Age verification logo path:", logo);
  console.log("Age verification logo URL:", logoUrl);
  
  return (
    <div className="flex justify-center">
      <img 
        src={logoUrl} 
        alt="Gallery Logo" 
        className="h-40 w-auto object-contain" // Increased from h-32 to h-40
      />
    </div>
  );
};
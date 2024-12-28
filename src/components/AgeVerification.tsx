import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Shield, Lock } from "lucide-react";

interface AgeVerificationProps {
  onVerified: () => void;
  id: string;
  logo?: string | null;
  verificationText?: string | null;
  buttonText?: string | null;
}

export const AgeVerification = ({
  onVerified,
  id,
  logo,
  verificationText,
  buttonText
}: AgeVerificationProps) => {
  const [password, setPassword] = useState("");
  const { toast } = useToast();

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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (storefront?.password_required && password !== storefront?.password) {
      toast({
        variant: "destructive",
        description: "Incorrect password",
      });
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

  const logoUrl = logo ? supabase.storage.from("gallery_images").getPublicUrl(logo).data.publicUrl : null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Blurred background */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        style={{
          backgroundColor: storefront?.primary_color ? `${storefront.primary_color}80` : 'rgba(0, 0, 0, 0.5)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
          {logoUrl && (
            <div className="flex justify-center mb-8">
              <img
                src={logoUrl}
                alt="Logo"
                className="w-32 h-32 object-contain"
              />
            </div>
          )}

          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl font-bold" style={{ color: storefront?.primary_font_color || '#000000' }}>
              {storefront?.heading_text || "Age Verification Required"}
            </h1>
            <p className="text-xl" style={{ color: storefront?.secondary_font_color || '#666666' }}>
              {storefront?.subheading_text}
            </p>
          </div>

          {storefront?.password_required ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full"
                  />
                </div>
              </div>
              <Button 
                type="submit"
                className="w-full"
                style={{
                  backgroundColor: storefront?.accent_color || '#2A6041',
                  color: storefront?.accent_font_color || '#ffffff'
                }}
              >
                <Shield className="w-4 h-4 mr-2" />
                {buttonText || storefront?.button_text || "Enter"}
              </Button>
            </form>
          ) : (
            <Button 
              onClick={onVerified}
              className="w-full"
              style={{
                backgroundColor: storefront?.accent_color || '#2A6041',
                color: storefront?.accent_font_color || '#ffffff'
              }}
            >
              <Shield className="w-4 h-4 mr-2" />
              {buttonText || storefront?.button_text || "Enter"}
            </Button>
          )}

          {/* Legal disclaimer moved to bottom */}
          <div className="mt-8 text-center">
            <p className="text-xs italic text-gray-500" style={{ color: storefront?.secondary_font_color || '#666666' }}>
              {verificationText || storefront?.age_verification_text || "By entering, you confirm that you meet the legal requirements to view this content."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
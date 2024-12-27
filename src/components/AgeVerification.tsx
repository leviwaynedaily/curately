import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AgeVerificationLogo } from "./age-verification/AgeVerificationLogo";
import { AgeVerificationForm } from "./age-verification/AgeVerificationForm";

interface AgeVerificationProps {
  onVerified: () => void;
  tenantId: string;
  logo?: string;
}

export const AgeVerification = ({ onVerified, tenantId, logo }: AgeVerificationProps) => {
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleVerification = async () => {
    if (!isAgeConfirmed) {
      toast({
        title: "Age Confirmation Required",
        description: "Please confirm that you are 21 or older.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Verifying gallery password...");
      const { data, error } = await supabase
        .from("galleries")
        .select("password")
        .eq("id", tenantId)
        .single();

      if (error) {
        console.error("Error fetching gallery:", error);
        throw error;
      }

      const isCorrect = !data.password || data.password === password;
      console.log("Password verification result:", isCorrect);
      
      if (isCorrect) {
        localStorage.setItem("age-verified", "true");
        localStorage.setItem(`gallery-${tenantId}-auth`, "true");
        onVerified();
      } else {
        toast({
          title: "Incorrect Password",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during verification:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8 space-y-6 animate-fade-up">
        <AgeVerificationLogo logo={logo} />
        
        <h2 className="text-2xl font-semibold text-center">Age Verification Required</h2>
        
        <AgeVerificationForm
          isAgeConfirmed={isAgeConfirmed}
          setIsAgeConfirmed={setIsAgeConfirmed}
          password={password}
          setPassword={setPassword}
          onSubmit={handleVerification}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
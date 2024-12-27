import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
        {logo && (
          <div className="flex justify-center">
            <img 
              src={logo} 
              alt="Gallery Logo" 
              className="h-24 w-auto object-contain"
            />
          </div>
        )}
        
        <h2 className="text-2xl font-semibold text-center">Age Verification Required</h2>
        
        <div className="space-y-6">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="age-confirm"
              checked={isAgeConfirmed}
              onCheckedChange={(checked) => setIsAgeConfirmed(checked as boolean)}
              className="mt-1"
            />
            <label htmlFor="age-confirm" className="text-sm text-gray-600">
              I confirm that I am 21 years of age or older and agree to the Terms of Service and Privacy Policy.
            </label>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Site Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter site password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>

          <Button
            onClick={handleVerification}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-6"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Enter Site"}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            This website contains age-restricted content. By entering, you accept our terms and confirm your legal age to view such content.
          </p>
        </div>
      </div>
    </div>
  );
};
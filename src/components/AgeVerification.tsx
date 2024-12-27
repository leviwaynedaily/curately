import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

interface AgeVerificationProps {
  onVerified: () => void;
  logo?: string;
}

export const AgeVerification = ({ onVerified, logo }: AgeVerificationProps) => {
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);
  const { toast } = useToast();

  const handleVerification = () => {
    if (!isAgeConfirmed) {
      toast({
        title: "Age Confirmation Required",
        description: "Please confirm that you are 21 or older.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("age-verified", "true");
    onVerified();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8 space-y-6 animate-fade-up">
        {logo ? (
          <img src={logo} alt="Gallery Logo" className="h-16 mx-auto mb-6" />
        ) : (
          <h2 className="text-2xl font-semibold text-center">Age Verification Required</h2>
        )}
        
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

          <Button
            onClick={handleVerification}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-6"
          >
            Enter Site
          </Button>

          <p className="text-xs text-gray-500 text-center">
            This website contains age-restricted content. By entering, you accept our terms and confirm your legal age to view such content.
          </p>
        </div>
      </div>
    </div>
  );
};
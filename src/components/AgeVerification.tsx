import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface AgeVerificationProps {
  onVerified: () => void;
}

export const AgeVerification = ({ onVerified }: AgeVerificationProps) => {
  const [birthYear, setBirthYear] = useState("");
  const { toast } = useToast();

  const handleVerification = () => {
    const year = parseInt(birthYear);
    const currentYear = new Date().getFullYear();
    
    if (!year || year > currentYear || year < 1900) {
      toast({
        title: "Invalid Year",
        description: "Please enter a valid birth year.",
        variant: "destructive",
      });
      return;
    }

    if (currentYear - year < 21) {
      toast({
        title: "Age Restriction",
        description: "You must be 21 or older to access this content.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("age-verified", "true");
    onVerified();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full p-8 space-y-6 animate-fade-up">
        <h2 className="text-2xl font-semibold text-center text-white">Age Verification Required</h2>
        <p className="text-white/80 text-center">
          You must be 21 or older to access this content.
        </p>
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Enter birth year"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
            maxLength={4}
          />
          <Button
            onClick={handleVerification}
            className="w-full bg-accent hover:bg-accent/90 text-white"
          >
            Verify Age
          </Button>
        </div>
      </div>
    </div>
  );
};
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface PasswordProtectionProps {
  onAuthenticated: () => void;
  tenantId: string;
}

export const PasswordProtection = ({ onAuthenticated, tenantId }: PasswordProtectionProps) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement actual password verification with Supabase
      const isCorrect = password === "demo123"; // Temporary demo password
      
      if (isCorrect) {
        localStorage.setItem(`gallery-${tenantId}-auth`, "true");
        onAuthenticated();
      } else {
        toast({
          title: "Incorrect Password",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full p-8 space-y-6 animate-fade-up">
        <h2 className="text-2xl font-semibold text-center text-white">Enter Gallery Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Enter Gallery"}
          </Button>
        </form>
      </div>
    </div>
  );
};
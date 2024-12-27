import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PasswordProtectionProps {
  onAuthenticated: () => void;
  tenantId: string;
  logo?: string;
}

export const PasswordProtection = ({ onAuthenticated, tenantId, logo }: PasswordProtectionProps) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      const isCorrect = data.password === password;
      console.log("Password verification result:", isCorrect);
      
      if (isCorrect) {
        localStorage.setItem(`gallery-${tenantId}-auth`, "true");
        onAuthenticated();
        toast({
          description: "Access granted",
        });
      } else {
        toast({
          title: "Incorrect Password",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during password verification:", error);
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
      <div className="bg-white rounded-lg max-w-md w-full p-8 space-y-6 animate-fade-up">
        {logo ? (
          <img src={logo} alt="Gallery Logo" className="h-16 mx-auto mb-6" />
        ) : (
          <h2 className="text-2xl font-semibold text-center">Enter Gallery Password</h2>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-6"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Enter Site"}
          </Button>
        </form>
      </div>
    </div>
  );
};
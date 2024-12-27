import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AgeVerificationFormProps {
  isAgeConfirmed: boolean;
  setIsAgeConfirmed: (checked: boolean) => void;
  password: string;
  setPassword: (password: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const AgeVerificationForm = ({
  isAgeConfirmed,
  setIsAgeConfirmed,
  password,
  setPassword,
  onSubmit,
  isLoading
}: AgeVerificationFormProps) => {
  return (
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
        onClick={onSubmit}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white py-6"
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Enter Site"}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        This website contains age-restricted content. By entering, you accept our terms and confirm your legal age to view such content.
      </p>
    </div>
  );
};
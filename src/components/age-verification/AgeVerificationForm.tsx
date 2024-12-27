import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type AgeVerificationFormProps = {
  isLoading: boolean;
  onVerify: (password?: string) => void;
  headingText: string;
  subheadingText: string;
  verificationText: string;
  buttonText: string;
  accentColor?: string;
  passwordRequired?: boolean;
  error?: string | null;
};

export const AgeVerificationForm = ({
  isLoading,
  onVerify,
  headingText,
  subheadingText,
  verificationText,
  buttonText,
  accentColor,
  passwordRequired,
  error,
}: AgeVerificationFormProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [password, setPassword] = useState("");

  const buttonStyle = accentColor ? {
    backgroundColor: accentColor,
    color: '#FFFFFF',
    opacity: 1,
  } : undefined;

  const checkboxStyle = accentColor ? {
    "--checkbox-color": accentColor,
  } as React.CSSProperties : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(passwordRequired ? password : undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">{headingText}</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="age-verification"
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked as boolean)}
            style={checkboxStyle}
            className="[--checkbox-color:var(--checkbox-color)]"
          />
          <Label
            htmlFor="age-verification"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {verificationText}
          </Label>
        </div>

        {passwordRequired && (
          <div className="space-y-2">
            <Label htmlFor="password">Site Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter site password"
            />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <Button
          type="submit"
          className="w-full transition-colors"
          style={buttonStyle}
          disabled={!isChecked || isLoading}
        >
          {buttonText}
        </Button>

        <p className="text-sm text-center text-muted-foreground mt-4">
          {subheadingText}
        </p>
      </div>
    </form>
  );
};
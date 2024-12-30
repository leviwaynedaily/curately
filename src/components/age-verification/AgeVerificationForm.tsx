import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type AgeVerificationFormProps = {
  isLoading: boolean;
  onVerify: (password?: string, ageVerified?: boolean) => void;
  headingText: string;
  subheadingText: string;
  verificationText: string;
  buttonText: string;
  accentColor?: string;
  passwordRequired?: boolean;
  ageVerificationEnabled?: boolean;
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
  ageVerificationEnabled,
  error,
}: AgeVerificationFormProps) => {
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [password, setPassword] = useState("");

  const buttonStyle = accentColor ? {
    backgroundColor: accentColor,
    color: '#FFFFFF',
    opacity: (!ageVerificationEnabled || isAgeVerified) && (!passwordRequired || password) ? 1 : 0.5,
  } : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!ageVerificationEnabled || isAgeVerified) && (!passwordRequired || password)) {
      onVerify(passwordRequired ? password : undefined, isAgeVerified);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 age-verification-form">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">{headingText}</h2>
        <p className="text-sm text-muted-foreground">{subheadingText}</p>
      </div>

      <div className="space-y-4">
        {ageVerificationEnabled && (
          <div className="checkbox-wrapper">
            <Checkbox
              id="age-verification"
              checked={isAgeVerified}
              onCheckedChange={(checked) => setIsAgeVerified(checked as boolean)}
              style={{ "--checkbox-color": accentColor } as React.CSSProperties}
              className="[--checkbox-color:var(--checkbox-color)]"
            />
            <Label
              htmlFor="age-verification"
              className="text-sm text-muted-foreground leading-tight"
            >
              {verificationText}
            </Label>
          </div>
        )}

        {passwordRequired && (
          <>
            {ageVerificationEnabled && <Separator className="my-4" />}
            <div className="space-y-2">
              <Label htmlFor="password">Site Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter site password"
                className="w-full"
              />
            </div>
          </>
        )}

        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}

        <Button
          type="submit"
          className="w-full transition-colors"
          style={buttonStyle}
          disabled={
            (ageVerificationEnabled && !isAgeVerified) || 
            (passwordRequired && !password) || 
            isLoading
          }
        >
          {buttonText}
        </Button>

        <p className="text-[13px] text-muted-foreground leading-tight text-center">
          {subheadingText}
        </p>
      </div>
    </form>
  );
};
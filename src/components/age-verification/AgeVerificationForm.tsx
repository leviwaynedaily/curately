import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

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
    opacity: isChecked && (!passwordRequired || password) ? 1 : 0.5,
  } : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isChecked && (!passwordRequired || password)) {
      onVerify(passwordRequired ? password : undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 age-verification-form">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">{headingText}</h2>
        <p className="text-sm text-muted-foreground">{subheadingText}</p>
      </div>

      <div className="space-y-4">
        <div className="checkbox-wrapper">
          <Checkbox
            id="age-verification"
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked as boolean)}
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

        {passwordRequired && (
          <>
            <Separator className="my-4" />
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
          disabled={!isChecked || (passwordRequired && !password) || isLoading}
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
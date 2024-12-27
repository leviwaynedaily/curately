import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type AgeVerificationFormProps = {
  isLoading: boolean;
  onVerify: () => void;
  headingText: string;
  subheadingText: string;
  verificationText: string;
  buttonText: string;
  accentColor?: string;
};

export const AgeVerificationForm = ({
  isLoading,
  onVerify,
  headingText,
  subheadingText,
  verificationText,
  buttonText,
  accentColor,
}: AgeVerificationFormProps) => {
  const [isChecked, setIsChecked] = useState(false);

  // Ensure the color is applied without any opacity
  const buttonStyle = accentColor ? {
    backgroundColor: accentColor,
    color: '#FFFFFF',
    opacity: 1, // Force full opacity
  } : undefined;

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">{headingText}</h2>
        <p className="text-muted-foreground">{subheadingText}</p>
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="age-verification"
          checked={isChecked}
          onCheckedChange={(checked) => setIsChecked(checked as boolean)}
        />
        <Label
          htmlFor="age-verification"
          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {verificationText}
        </Label>
      </div>

      <Button
        className="w-full transition-colors"
        style={buttonStyle}
        disabled={!isChecked || isLoading}
        onClick={onVerify}
      >
        {buttonText}
      </Button>
    </div>
  );
};
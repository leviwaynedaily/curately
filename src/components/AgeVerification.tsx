import { useState } from "react";
import { AgeVerificationContainer } from "./age-verification/AgeVerificationContainer";
import { InstructionsContainer } from "./age-verification/InstructionsContainer";

interface AgeVerificationProps {
  onVerified: () => void;
  id: string;
  logo?: string | null;
  verificationText?: string | null;
  buttonText?: string | null;
  error?: string | null;
  onError?: (error: string | null) => void;
  instructionsEnabled?: boolean;
  instructionsContent?: string | null;
  instructionsButtonText?: string | null;
}

export const AgeVerification = (props: AgeVerificationProps) => {
  const [isAgeVerified, setIsAgeVerified] = useState(false);

  const handleAgeVerified = () => {
    console.log("Age verification completed");
    setIsAgeVerified(true);
  };

  const handleInstructionsConfirmed = () => {
    console.log("Instructions confirmed");
    props.onVerified();
  };

  // Show instructions after age verification if enabled
  if (isAgeVerified && props.instructionsEnabled) {
    console.log("Showing instructions screen", {
      logo: props.logo,
      content: props.instructionsContent,
      buttonText: props.instructionsButtonText
    });
    return (
      <InstructionsContainer
        logo={props.logo}
        content={props.instructionsContent}
        buttonText={props.instructionsButtonText}
        onConfirm={handleInstructionsConfirmed}
      />
    );
  }

  // Show age verification initially
  return (
    <AgeVerificationContainer 
      {...props} 
      onVerified={handleAgeVerified}
    />
  );
};
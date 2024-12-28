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
    console.log("Age verification completed", {
      instructionsEnabled: props.instructionsEnabled,
      instructionsContent: props.instructionsContent
    });
    
    // Set age verified state
    setIsAgeVerified(true);
    
    // Only complete verification if instructions are not enabled
    if (!props.instructionsEnabled) {
      console.log("No instructions enabled, completing verification");
      props.onVerified();
    } else {
      console.log("Instructions enabled, showing instructions screen");
    }
  };

  const handleInstructionsConfirmed = () => {
    console.log("Instructions confirmed, completing verification");
    props.onVerified();
  };

  // Show instructions after age verification if enabled
  if (isAgeVerified && props.instructionsEnabled) {
    console.log("Rendering instructions screen", {
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
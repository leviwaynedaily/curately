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
    
    // If instructions are not enabled, complete the verification process
    if (!props.instructionsEnabled) {
      props.onVerified();
    }
  };

  const handleInstructionsConfirmed = () => {
    console.log("Instructions confirmed");
    props.onVerified();
  };

  if (isAgeVerified && props.instructionsEnabled) {
    return (
      <InstructionsContainer
        logo={props.logo}
        content={props.instructionsContent}
        buttonText={props.instructionsButtonText}
        onConfirm={handleInstructionsConfirmed}
      />
    );
  }

  return <AgeVerificationContainer {...props} onVerified={handleAgeVerified} />;
};
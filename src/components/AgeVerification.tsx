import { AgeVerificationContainer } from "./age-verification/AgeVerificationContainer";

interface AgeVerificationProps {
  onVerified: () => void;
  id: string;
  logo?: string | null;
  verificationText?: string | null;
  buttonText?: string | null;
}

export const AgeVerification = (props: AgeVerificationProps) => {
  return <AgeVerificationContainer {...props} />;
};
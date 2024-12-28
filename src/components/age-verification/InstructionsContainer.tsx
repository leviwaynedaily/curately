import { Button } from "@/components/ui/button";
import { AgeVerificationLogo } from "./AgeVerificationLogo";

interface InstructionsContainerProps {
  logo?: string | null;
  content?: string | null;
  buttonText?: string | null;
  onConfirm: () => void;
}

export const InstructionsContainer = ({
  logo,
  content,
  buttonText = "Enter Site",
  onConfirm,
}: InstructionsContainerProps) => {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 backdrop-blur-md bg-black/30" />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
          {logo && <AgeVerificationLogo logo={logo} />}
          
          <div className="mt-6 space-y-6">
            {content && (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
            
            <Button
              onClick={onConfirm}
              className="w-full"
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
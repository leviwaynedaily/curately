import { Button } from "@/components/ui/button";
import { AgeVerificationLogo } from "./AgeVerificationLogo";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  console.log("Rendering InstructionsContainer", { logo, content, buttonText });
  
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 backdrop-blur-md bg-black/30" />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl max-h-[90vh] flex flex-col">
          {logo && (
            <div className="flex-shrink-0">
              <AgeVerificationLogo logo={logo} />
            </div>
          )}
          
          <div className="mt-6 flex flex-col flex-grow min-h-0">
            {content && (
              <ScrollArea className="flex-grow">
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </ScrollArea>
            )}
            
            <Button
              onClick={onConfirm}
              className="w-full mt-6 flex-shrink-0"
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
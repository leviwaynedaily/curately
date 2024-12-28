import { Button } from "@/components/ui/button";
import { AgeVerificationLogo } from "./AgeVerificationLogo";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InstructionsContainerProps {
  logo?: string | null;
  content?: string | null;
  buttonText?: string | null;
  onConfirm: () => void;
  accentColor?: string | null;
}

export const InstructionsContainer = ({
  logo,
  content,
  buttonText = "Enter Site",
  onConfirm,
  accentColor,
}: InstructionsContainerProps) => {
  console.log("Rendering InstructionsContainer with accent color:", accentColor);
  
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 backdrop-blur-md bg-black/30" />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl max-h-[90vh] flex flex-col">
          {logo && (
            <div className="flex-shrink-0 mb-6">
              <AgeVerificationLogo logo={logo} />
            </div>
          )}
          
          <div className="flex-1 min-h-0 flex flex-col">
            {content && (
              <ScrollArea className="flex-1 mb-6 overflow-y-auto">
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </ScrollArea>
            )}
            
            <Button
              onClick={onConfirm}
              className="w-full mt-auto"
              style={{
                backgroundColor: accentColor || 'var(--accent-color, var(--primary))',
                color: 'var(--accent-font-color, white)',
              }}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
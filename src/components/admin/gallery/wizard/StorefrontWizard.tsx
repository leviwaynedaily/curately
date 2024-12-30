import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { WizardNameStep } from "./steps/WizardNameStep";
import { WizardDescriptionStep } from "./steps/WizardDescriptionStep";
import { useStorefrontWizard } from "./hooks/useStorefrontWizard";

type StorefrontWizardProps = {
  isOpen: boolean;
  onClose: () => void;
  businessId?: string;
};

export const StorefrontWizard = ({
  isOpen,
  onClose,
  businessId,
}: StorefrontWizardProps) => {
  const {
    form,
    step,
    isSubmitting,
    nextStep,
    previousStep,
    onSubmit,
  } = useStorefrontWizard(businessId, onClose);

  console.log("StorefrontWizard render:", { step, isSubmitting, isOpen });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Storefront</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            {step === 1 && <WizardNameStep form={form} />}
            {step === 2 && <WizardDescriptionStep form={form} />}

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={previousStep}
                >
                  Previous
                </Button>
              )}
              
              {step < 2 ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  className="ml-auto"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="ml-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Storefront"
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
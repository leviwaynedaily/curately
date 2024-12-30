import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { gallerySchema } from "@/lib/validations/gallery";
import { Loader2 } from "lucide-react";

type StorefrontWizardProps = {
  isOpen: boolean;
  onClose: () => void;
  businessId?: string;
};

export const StorefrontWizard = ({ isOpen, onClose, businessId }: StorefrontWizardProps) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      name: "",
      description: "",
      business_id: businessId || "",
      status: "active",
    },
  });

  const handleSubmit = async (values: any) => {
    console.log("Submitting wizard form with values:", values);
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("storefronts")
        .insert(values)
        .select()
        .single();

      if (error) throw error;

      console.log("Storefront created:", data);
      queryClient.invalidateQueries({ queryKey: ["storefronts"] });
      toast({ description: "Storefront created successfully" });
      navigate(`/admin/storefront/${data.id}`);
    } catch (error) {
      console.error("Error creating storefront:", error);
      toast({
        variant: "destructive",
        description: "There was an error creating the storefront",
      });
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const nextStep = () => {
    const currentStepValid = form.trigger(step === 1 ? ["name"] : ["description"]);
    if (currentStepValid) {
      setStep(step + 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Storefront</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {step === 1 && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter storefront name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {step === 2 && (
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter storefront description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  Previous
                </Button>
              )}
              
              {step < 2 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
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
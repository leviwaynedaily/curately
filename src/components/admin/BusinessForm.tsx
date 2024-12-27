import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessSchema, type BusinessFormValues } from "@/lib/validations/business";
import { Form } from "@/components/ui/form";
import { BusinessNameField } from "./business/BusinessNameField";
import { BusinessFormActions } from "./business/BusinessFormActions";

type BusinessFormProps = {
  isOpen: boolean;
  onClose: () => void;
  business?: {
    id: string;
    name: string;
    status: string;
  };
};

export const BusinessForm = ({ isOpen, onClose, business }: BusinessFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: business?.name || "",
      status: business?.status || "active",
    },
  });

  // Reset form when business prop changes
  useState(() => {
    if (business) {
      console.log("Resetting form with business data:", business);
      form.reset({
        name: business.name,
        status: business.status,
      });
    }
  }, [business, form]);

  const handleSubmit = async (values: BusinessFormValues) => {
    setIsLoading(true);
    console.log("Submitting business form...", values);

    try {
      if (business?.id) {
        const { error } = await supabase
          .from("businesses")
          .update({
            name: values.name,
            status: values.status,
          })
          .eq("id", business.id);

        if (error) throw error;
        console.log("Business updated successfully");
        toast({ description: "Business updated successfully" });
      } else {
        const { error } = await supabase
          .from("businesses")
          .insert({
            name: values.name,
            status: values.status,
          });

        if (error) throw error;
        console.log("Business created successfully");
        toast({ description: "Business created successfully" });
      }

      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      onClose();
    } catch (error) {
      console.error("Error saving business:", error);
      toast({
        variant: "destructive",
        description: "There was an error saving the business",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{business ? "Edit Business" : "Add Business"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <BusinessNameField form={form} />
            <BusinessFormActions isLoading={isLoading} onCancel={onClose} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
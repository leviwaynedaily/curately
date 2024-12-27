import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessSchema, type BusinessFormValues } from "@/lib/validations/business";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
    },
  });

  const handleSubmit = async (values: BusinessFormValues) => {
    setIsLoading(true);
    console.log("Submitting business form...", values);

    try {
      if (business?.id) {
        const { error } = await supabase
          .from("businesses")
          .update(values)
          .eq("id", business.id);

        if (error) throw error;
        console.log("Business updated successfully");
        toast({ description: "Business updated successfully" });
      } else {
        const { error } = await supabase.from("businesses").insert([values]);

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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
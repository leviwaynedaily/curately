import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gallerySchema, type GalleryFormValues } from "@/lib/validations/gallery";
import { Form } from "@/components/ui/form";
import { GalleryNameField } from "./gallery/GalleryNameField";
import { GalleryPasswordField } from "./gallery/GalleryPasswordField";
import { GalleryFormActions } from "./gallery/GalleryFormActions";

type GalleryFormProps = {
  isOpen: boolean;
  onClose: () => void;
  businessId?: string;
  gallery?: {
    id: string;
    name: string;
    status: string;
    password?: string;
  };
};

export const GalleryForm = ({
  isOpen,
  onClose,
  businessId,
  gallery,
}: GalleryFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      name: gallery?.name || "",
      password: gallery?.password || "",
      status: gallery?.status || "active",
    },
  });

  const handleSubmit = async (values: GalleryFormValues) => {
    setIsLoading(true);
    console.log("Submitting gallery form...", values);

    try {
      if (gallery?.id) {
        const { error } = await supabase
          .from("galleries")
          .update({
            name: values.name,
            password: values.password,
            status: values.status,
          })
          .eq("id", gallery.id);

        if (error) throw error;
        console.log("Gallery updated successfully");
        toast({ description: "Gallery updated successfully" });
      } else {
        const { error } = await supabase
          .from("galleries")
          .insert({
            name: values.name,
            password: values.password,
            status: values.status,
            business_id: businessId,
          });

        if (error) throw error;
        console.log("Gallery created successfully");
        toast({ description: "Gallery created successfully" });
      }

      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      onClose();
    } catch (error) {
      console.error("Error saving gallery:", error);
      toast({
        variant: "destructive",
        description: "There was an error saving the gallery",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{gallery ? "Edit Gallery" : "Add Gallery"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <GalleryNameField form={form} />
            <GalleryPasswordField form={form} />
            <GalleryFormActions isLoading={isLoading} onCancel={onClose} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
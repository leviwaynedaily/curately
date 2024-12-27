import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gallerySchema, type GalleryFormValues } from "@/lib/validations/gallery";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Gallery name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      value={field.value || ""}
                    />
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
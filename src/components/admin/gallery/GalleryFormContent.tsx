import { Form } from "@/components/ui/form";
import { GalleryNameField } from "./GalleryNameField";
import { GalleryBusinessField } from "./GalleryBusinessField";
import { GalleryPasswordField } from "./GalleryPasswordField";
import { GalleryFormActions } from "./GalleryFormActions";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";

type GalleryFormContentProps = {
  form: UseFormReturn<GalleryFormValues>;
  isLoading: boolean;
  onSubmit: (values: GalleryFormValues) => Promise<void>;
  onCancel: () => void;
};

export const GalleryFormContent = ({
  form,
  isLoading,
  onSubmit,
  onCancel,
}: GalleryFormContentProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <GalleryNameField form={form} />
        <GalleryBusinessField form={form} />
        <GalleryPasswordField form={form} />
        <GalleryFormActions isLoading={isLoading} onCancel={onCancel} />
      </form>
    </Form>
  );
};
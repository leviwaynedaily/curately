import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { getStorefrontFilePath } from "@/utils/storefrontFileUtils";
import { PWAIconPreview } from "./PWAIconPreview";
import { PWAIconUploadButton } from "./PWAIconUploadButton";
import { usePWAIconUpload } from "./hooks/usePWAIconUpload";

type PWAIconUploadFieldProps = {
  form: UseFormReturn<GalleryFormValues>;
  size: "192" | "512";
};

export const PWAIconUploadField = ({ form, size }: PWAIconUploadFieldProps) => {
  const fieldName = `pwa_icon_${size}` as keyof GalleryFormValues;
  const uploadId = `pwa-icon-${size}-upload`;
  const { isUploading, handleIconUpload, clearIcon } = usePWAIconUpload(form, fieldName, size);
  const fieldValue = form.watch(fieldName);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            {`PWA Icon ${size}×${size}`}
            <span className="text-sm text-muted-foreground font-normal">
              (PNG only)
            </span>
          </FormLabel>
          <FormControl>
            <div className="space-y-4">
              {field.value ? (
                <PWAIconPreview 
                  filePath={field.value} 
                  size={size} 
                  onClear={clearIcon}
                />
              ) : (
                <PWAIconUploadButton
                  isUploading={isUploading}
                  uploadId={uploadId}
                  onFileSelect={handleIconUpload}
                  accept="image/png"
                />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
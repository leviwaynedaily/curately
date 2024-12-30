import { supabase } from "@/integrations/supabase/client";

type ScreenshotPreviewProps = {
  filePath: string;
  type: "desktop" | "mobile";
};

export const ScreenshotPreview = ({ filePath, type }: ScreenshotPreviewProps) => {
  const imageUrl = supabase.storage
    .from("gallery_images")
    .getPublicUrl(filePath)
    .data.publicUrl;

  console.log(`Rendering ${type} screenshot preview:`, { filePath, imageUrl });

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">{type === "desktop" ? "Desktop" : "Mobile"} Screenshot Preview</h4>
      <div className="relative border rounded-lg p-2 bg-muted/20">
        <img
          src={imageUrl}
          alt={`${type} screenshot`}
          className="w-full h-auto rounded"
          onError={(e) => {
            console.error(`Error loading ${type} screenshot:`, e);
            e.currentTarget.src = ""; // Clear the broken image
          }}
        />
      </div>
    </div>
  );
};
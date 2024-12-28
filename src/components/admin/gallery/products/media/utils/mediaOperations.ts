import { supabase } from "@/integrations/supabase/client";

export const uploadMediaFile = async (file: File, productId: string) => {
  const fileExt = file.name.split(".").pop();
  const filePath = `${productId}/${crypto.randomUUID()}.${fileExt}`;
  const mediaType = file.type.startsWith("video/") ? "video" : "image";

  console.log(`Uploading ${mediaType} to storage:`, file.name);
  const { error: uploadError } = await supabase.storage
    .from("gallery_images")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Error uploading file:", file.name, uploadError);
    throw uploadError;
  }

  return { filePath, mediaType, fileName: file.name };
};

export const createMediaRecord = async (
  productId: string,
  filePath: string,
  mediaType: string,
  title: string,
  isPrimary: boolean
) => {
  console.log("Creating media record for:", title);
  const { error: dbError } = await supabase
    .from("product_media")
    .insert([{
      product_id: productId,
      file_path: filePath,
      media_type: mediaType,
      is_primary: isPrimary,
      title,
    }]);

  if (dbError) {
    console.error("Error creating media record:", dbError);
    throw dbError;
  }
};

export const deleteMediaRecord = async (mediaId: string) => {
  const { error } = await supabase
    .from("product_media")
    .delete()
    .eq("id", mediaId);

  if (error) throw error;
};

export const deleteMediaFile = async (filePath: string) => {
  const { error } = await supabase.storage
    .from("gallery_images")
    .remove([filePath]);

  if (error) {
    console.error("Error deleting file from storage:", error);
    throw error;
  }
};

export const updatePrimaryStatus = async (productId: string, mediaId: string) => {
  await supabase
    .from("product_media")
    .update({ is_primary: false })
    .eq("product_id", productId);

  const { error } = await supabase
    .from("product_media")
    .update({ is_primary: true })
    .eq("id", mediaId);

  if (error) throw error;
};
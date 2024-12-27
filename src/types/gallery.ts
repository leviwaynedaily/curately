export type Gallery = {
  id: string;
  name: string;
  password?: string | null;
  businesses?: {
    name: string;
  };
  gallery_images?: GalleryImage[];
};

export type GalleryImage = {
  id: string;
  file_path: string;
  title?: string | null;
  description?: string | null;
};
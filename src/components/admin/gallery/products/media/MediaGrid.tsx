import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Video, X, Image as ImageIcon } from "lucide-react";

type MediaGridProps = {
  media: Array<{
    id: string;
    file_path: string;
    media_type: string;
    is_primary: boolean;
  }>;
  onDelete: (mediaId: string, filePath: string) => void;
  onSetPrimary: (mediaId: string) => void;
};

export const MediaGrid = ({ media, onDelete, onSetPrimary }: MediaGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {media.map((item) => (
        <div key={item.id} className="relative group">
          {item.media_type === "video" ? (
            <video
              src={supabase.storage.from("gallery_images").getPublicUrl(item.file_path).data.publicUrl}
              className="w-full aspect-square object-cover rounded-lg"
              controls
            />
          ) : (
            <img
              src={supabase.storage.from("gallery_images").getPublicUrl(item.file_path).data.publicUrl}
              alt=""
              className="w-full aspect-square object-cover rounded-lg"
            />
          )}
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(item.id, item.file_path)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute bottom-2 right-2 flex gap-2">
            {item.media_type === "video" ? (
              <Video className="h-4 w-4" />
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}
            <Button
              variant={item.is_primary ? "default" : "secondary"}
              size="sm"
              onClick={() => onSetPrimary(item.id)}
            >
              {item.is_primary ? "Primary" : "Set as Primary"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
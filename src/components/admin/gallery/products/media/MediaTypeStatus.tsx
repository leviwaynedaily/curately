import { Image as ImageIcon, Video } from "lucide-react";

type MediaTypeStatusProps = {
  media: Array<{ media_type: string }>;
};

export const MediaTypeStatus = ({ media }: MediaTypeStatusProps) => {
  const hasImage = media.some((item) => item.media_type === "image");
  const hasVideo = media.some((item) => item.media_type === "video");

  return (
    <div className="flex gap-2 items-center">
      <div className={`flex items-center gap-1 ${hasImage ? 'text-green-500' : 'text-gray-400'}`}>
        <ImageIcon className="h-4 w-4" />
        {hasImage ? 'Added' : 'Missing'}
      </div>
      <div className={`flex items-center gap-1 ${hasVideo ? 'text-green-500' : 'text-gray-400'}`}>
        <Video className="h-4 w-4" />
        {hasVideo ? 'Added' : 'Missing'}
      </div>
    </div>
  );
};
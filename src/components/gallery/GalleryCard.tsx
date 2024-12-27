import { Gallery } from "@/types/gallery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GalleryHorizontal, Lock } from "lucide-react";

type GalleryCardProps = {
  gallery: Gallery;
};

export const GalleryCard = ({ gallery }: GalleryCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{gallery.name}</CardTitle>
        {gallery.password && <Lock className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <GalleryHorizontal className="h-4 w-4" />
          <span>{gallery.businesses?.name}</span>
        </div>
      </CardContent>
    </Card>
  );
};
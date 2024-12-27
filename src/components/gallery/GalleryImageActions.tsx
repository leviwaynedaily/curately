import { Share2, Download, Filter, ArrowUpDown, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { GalleryImage } from "@/types/gallery";

type GalleryImageActionsProps = {
  image: GalleryImage;
  onStartSlideshow: () => void;
  onReorderClick: () => void;
  onFilterClick: () => void;
  isAdmin: boolean;
};

export const GalleryImageActions = ({
  image,
  onStartSlideshow,
  onReorderClick,
  onFilterClick,
  isAdmin,
}: GalleryImageActionsProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      const imageUrl = `${
        import.meta.env.VITE_SUPABASE_URL
      }/storage/v1/object/public/gallery_images/${image.file_path}`;
      await navigator.share({
        title: image.title || "Shared Image",
        text: image.description || "Check out this image!",
        url: imageUrl,
      });
      toast({ description: "Image shared successfully" });
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback to copying link if share API is not supported
      navigator.clipboard.writeText(window.location.href);
      toast({ description: "Link copied to clipboard" });
    }
  };

  const handleDownload = async () => {
    try {
      const imageUrl = `${
        import.meta.env.VITE_SUPABASE_URL
      }/storage/v1/object/public/gallery_images/${image.file_path}`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = image.title || "downloaded-image";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({ description: "Image downloaded successfully" });
    } catch (error) {
      console.error("Error downloading:", error);
      toast({
        variant: "destructive",
        description: "Failed to download image",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={handleDownload}>
        <Download className="h-4 w-4" />
      </Button>
      {isAdmin && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onFilterClick}>
                Apply Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={onReorderClick}>
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </>
      )}
      <Button variant="outline" size="sm" onClick={onStartSlideshow}>
        <Play className="h-4 w-4" />
      </Button>
    </div>
  );
};
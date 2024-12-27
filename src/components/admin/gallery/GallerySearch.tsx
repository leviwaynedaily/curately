import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type GallerySearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export const GallerySearch = ({ value, onChange }: GallerySearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search galleries..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};
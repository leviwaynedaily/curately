import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type GalleryHeaderProps = {
  name: string;
};

export const GalleryHeader = ({ name }: GalleryHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-8">
      <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <h1 className="text-4xl font-bold">{name}</h1>
    </div>
  );
};
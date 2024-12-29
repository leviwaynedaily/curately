import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ProductTableActionsProps = {
  galleryId: string;
};

export const ProductTableActions = ({
  galleryId,
}: ProductTableActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-4">
      <Button 
        variant="outline" 
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Storefronts
      </Button>
    </div>
  );
};
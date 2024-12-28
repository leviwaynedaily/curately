import { Button } from "@/components/ui/button";
import { Download, Upload, ExternalLink, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type ProductTableActionsProps = {
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  galleryId: string;
};

export const ProductTableActions = ({
  onExport,
  onImport,
  galleryId,
}: ProductTableActionsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isFullPage = location.pathname.includes("/admin/galleries/");

  const handlePageToggle = () => {
    if (isFullPage) {
      navigate(-1); // Go back to previous page
    } else {
      navigate(`/admin/galleries/${galleryId}/products`);
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={onExport} className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
      <div className="relative">
        <input
          type="file"
          accept=".csv"
          onChange={onImport}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Import CSV
        </Button>
      </div>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={handlePageToggle}
      >
        {isFullPage ? (
          <>
            <X className="h-4 w-4" />
            Close Full Page
          </>
        ) : (
          <>
            <ExternalLink className="h-4 w-4" />
            Open Full Page
          </>
        )}
      </Button>
    </div>
  );
};
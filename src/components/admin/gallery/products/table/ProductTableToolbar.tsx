import { Button } from "@/components/ui/button";
import { Download, Plus, Upload } from "lucide-react";

type ProductTableToolbarProps = {
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddProduct: () => void;
};

export const ProductTableToolbar = ({
  onExport,
  onImport,
  onAddProduct,
}: ProductTableToolbarProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold">Products</h2>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
        <div className="relative">
          <input
            type="file"
            accept=".csv"
            onChange={onImport}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </div>
        <Button 
          onClick={onAddProduct} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add product
        </Button>
      </div>
    </div>
  );
};
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Check, X } from "lucide-react";

type Category = {
  id: string;
  name: string;
  storefront_id: string;
};

type CategoryListProps = {
  categories: Category[];
  editingCategory: string | null;
  editValue: string;
  onEditStart: (id: string, name: string) => void;
  onEditCancel: () => void;
  onEditSave: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onEditValueChange: (value: string) => void;
};

export const CategoryList = ({
  categories,
  editingCategory,
  editValue,
  onEditStart,
  onEditCancel,
  onEditSave,
  onDelete,
  onEditValueChange,
}: CategoryListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories?.map((category) => (
          <TableRow key={category.id}>
            <TableCell>
              {editingCategory === category.id ? (
                <div className="flex gap-2">
                  <Input
                    value={editValue}
                    onChange={(e) => onEditValueChange(e.target.value)}
                  />
                  <Button
                    size="icon"
                    onClick={() => onEditSave(category.id, editValue)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={onEditCancel}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                category.name
              )}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onEditStart(category.id, category.name)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onDelete(category.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
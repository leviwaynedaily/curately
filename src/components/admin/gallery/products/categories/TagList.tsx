import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Check, X } from "lucide-react";

type Tag = {
  id: string;
  name: string;
  productCount?: number;
};

type TagListProps = {
  tags: Tag[];
  editingTag: string | null;
  editValue: string;
  onEditStart: (id: string, name: string) => void;
  onEditCancel: () => void;
  onEditSave: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onEditValueChange: (value: string) => void;
  storefrontId: string; // Added this prop
};

export const TagList = ({
  tags,
  editingTag,
  editValue,
  onEditStart,
  onEditCancel,
  onEditSave,
  onDelete,
  onEditValueChange,
}: TagListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Products</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tags.map((tag) => (
          <TableRow key={tag.id}>
            <TableCell>
              {editingTag === tag.id ? (
                <div className="flex gap-2">
                  <Input
                    value={editValue}
                    onChange={(e) => onEditValueChange(e.target.value)}
                  />
                  <Button
                    size="icon"
                    onClick={() => onEditSave(tag.id, editValue)}
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
                tag.name
              )}
            </TableCell>
            <TableCell>{tag.productCount}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    onEditStart(tag.id, tag.name);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onDelete(tag.id)}
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

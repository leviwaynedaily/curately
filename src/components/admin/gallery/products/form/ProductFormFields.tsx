import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { useTags } from "@/hooks/useTags";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type ProductFormFieldsProps = {
  formData: {
    name: string;
    description: string;
    price: string;
    sku: string;
    category: string;
    stock_quantity: string;
    tags?: string[];
  };
  storefrontId: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCategoryChange: (value: string) => void;
  onTagsChange: (tags: string[]) => void;
};

export const ProductFormFields = ({ 
  formData, 
  storefrontId,
  handleChange, 
  onCategoryChange,
  onTagsChange
}: ProductFormFieldsProps) => {
  const { categories, addCategory } = useCategories(storefrontId);
  const { tags, addTag } = useTags();
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    await addCategory(newCategory.trim());
    onCategoryChange(newCategory.trim());
    setNewCategory("");
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    await addTag(newTag.trim());
    onTagsChange([...(formData.tags || []), newTag.trim()]);
    setNewTag("");
  };

  return (
    <>
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name *
        </label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="price" className="block text-sm font-medium mb-1">
          Price
        </label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="sku" className="block text-sm font-medium mb-1">
          SKU
        </label>
        <Input
          id="sku"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category
        </label>
        <div className="flex gap-2">
          {categories?.length > 0 ? (
            <Select value={formData.category} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={formData.category}
              onChange={(e) => onCategoryChange(e.target.value)}
              placeholder="Enter a category"
            />
          )}
          <div className="flex gap-2">
            <Input
              placeholder="New category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button type="button" onClick={handleAddCategory} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-1">
          Tags
        </label>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {tags?.map((tag) => (
              <Button
                key={tag.id}
                type="button"
                variant={formData.tags?.includes(tag.name) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const newTags = formData.tags?.includes(tag.name)
                    ? formData.tags.filter(t => t !== tag.name)
                    : [...(formData.tags || []), tag.name];
                  onTagsChange(newTags);
                }}
              >
                {tag.name}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="New tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <Button type="button" onClick={handleAddTag} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div>
        <label htmlFor="stock_quantity" className="block text-sm font-medium mb-1">
          Stock Quantity
        </label>
        <Input
          id="stock_quantity"
          name="stock_quantity"
          type="number"
          value={formData.stock_quantity}
          onChange={handleChange}
        />
      </div>
    </>
  );
};
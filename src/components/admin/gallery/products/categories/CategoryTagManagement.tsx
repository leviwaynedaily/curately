import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryList } from "./CategoryList";
import { TagList } from "./TagList";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type CategoryTagManagementProps = {
  storefrontId: string;
};

export const CategoryTagManagement = ({ storefrontId }: CategoryTagManagementProps) => {
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [categories, setCategories] = useState<{ name: string; productCount?: number }[]>([]);
  const [tags, setTags] = useState<{ id: string; name: string; productCount?: number }[]>([]);
  const { toast } = useToast();

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      console.log("Adding new category:", newCategory.trim());
      
      const { error } = await supabase
        .from("categories")
        .insert({ name: newCategory.trim() });

      if (error) throw error;

      toast({ description: "Category added successfully" });
      setNewCategory("");
      // Refresh categories list here
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        variant: "destructive",
        description: "Failed to add category",
      });
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;

    try {
      const { error } = await supabase
        .from("tags")
        .insert({ name: newTag.trim() });

      if (error) throw error;

      toast({ description: "Tag added successfully" });
      setNewTag("");
      // Refresh tags list here
    } catch (error) {
      console.error("Error adding tag:", error);
      toast({
        variant: "destructive",
        description: "Failed to add tag",
      });
    }
  };

  const handleEditCategory = (name: string) => {
    setEditingCategory(name);
    setEditValue(name);
  };

  const handleEditTag = (id: string, name: string) => {
    setEditingTag(id);
    setEditValue(name);
  };

  const handleEditCategorySave = async (oldName: string, newName: string) => {
    // Implementation for saving category edits
    setEditingCategory(null);
  };

  const handleEditTagSave = async (id: string, newName: string) => {
    // Implementation for saving tag edits
    setEditingTag(null);
  };

  const handleDeleteCategory = async (name: string) => {
    // Implementation for deleting category
  };

  const handleDeleteTag = async (id: string) => {
    // Implementation for deleting tag
  };

  const handleKeyPress = (
    e: React.KeyboardEvent,
    handler: () => Promise<void>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handler();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Add new category..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, handleAddCategory)}
          />
          <Button onClick={handleAddCategory}>Add Category</Button>
        </div>

        <div className="flex items-center gap-4">
          <Input
            placeholder="Add new tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, handleAddTag)}
          />
          <Button onClick={handleAddTag}>Add Tag</Button>
        </div>
      </div>

      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <CategoryList
            categories={categories}
            editingCategory={editingCategory}
            editValue={editValue}
            onEditStart={handleEditCategory}
            onEditCancel={() => setEditingCategory(null)}
            onEditSave={handleEditCategorySave}
            onDelete={handleDeleteCategory}
            onEditValueChange={setEditValue}
            storefrontId={storefrontId}
          />
        </TabsContent>

        <TabsContent value="tags">
          <TagList
            tags={tags}
            editingTag={editingTag}
            editValue={editValue}
            onEditStart={handleEditTag}
            onEditCancel={() => setEditingTag(null)}
            onEditSave={handleEditTagSave}
            onDelete={handleDeleteTag}
            onEditValueChange={setEditValue}
            storefrontId={storefrontId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
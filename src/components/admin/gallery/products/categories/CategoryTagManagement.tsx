import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { CategoryList } from "./CategoryList";
import { TagList } from "./TagList";
import { useCategories } from "@/hooks/useCategories";
import { useTags } from "@/hooks/useTags";

type CategoryTagManagementProps = {
  storefrontId: string;
};

export const CategoryTagManagement = ({ storefrontId }: CategoryTagManagementProps) => {
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const {
    categories,
    isLoading: categoriesLoading,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategories(storefrontId);

  const {
    tags,
    isLoading: tagsLoading,
    addTag,
    updateTag,
    deleteTag,
  } = useTags();

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    await addCategory(newCategory.trim());
    setNewCategory("");
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    await addTag(newTag.trim());
    setNewTag("");
  };

  if (categoriesLoading || tagsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          <CategoryList
            categories={categories}
            editingCategory={editingCategory}
            editValue={editValue}
            onEditStart={(id, name) => {
              setEditingCategory(id);
              setEditValue(name);
            }}
            onEditCancel={() => setEditingCategory(null)}
            onEditSave={updateCategory}
            onDelete={deleteCategory}
            onEditValueChange={setEditValue}
          />
        </TabsContent>

        <TabsContent value="tags" className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="New tag name"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <Button onClick={handleAddTag}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
          </div>

          <TagList
            tags={tags}
            editingTag={editingTag}
            editValue={editValue}
            onEditStart={(id, name) => {
              setEditingTag(id);
              setEditValue(name);
            }}
            onEditCancel={() => setEditingTag(null)}
            onEditSave={updateTag}
            onDelete={deleteTag}
            onEditValueChange={setEditValue}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
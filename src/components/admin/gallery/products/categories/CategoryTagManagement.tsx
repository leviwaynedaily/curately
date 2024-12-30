import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryList } from "./CategoryList";
import { TagList } from "./TagList";

type CategoryTagManagementProps = {
  storefrontId: string;
};

export const CategoryTagManagement = ({ storefrontId }: CategoryTagManagementProps) => {
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", storefrontId],
    queryFn: async () => {
      console.log("Fetching products for storefront:", storefrontId);
      
      const { data: products } = await supabase
        .from("products")
        .select("category")
        .eq("storefront_id", storefrontId)
        .not("category", "is", null);

      const categoryCounts = products?.reduce((acc: Record<string, number>, product) => {
        if (product.category) {
          acc[product.category] = (acc[product.category] || 0) + 1;
        }
        return acc;
      }, {});

      return Object.entries(categoryCounts || {}).map(([name, count]) => ({
        name,
        productCount: count,
      }));
    },
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data: tags } = await supabase
        .from("tags")
        .select(`
          id,
          name,
          product_tags (
            product_id
          )
        `);

      return tags?.map(tag => ({
        id: tag.id,
        name: tag.name,
        productCount: tag.product_tags?.length || 0,
      })) || [];
    },
  });

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      // Simply update an existing product to add the new category
      const { data, error } = await supabase
        .from("products")
        .update({ category: newCategory.trim() })
        .eq("storefront_id", storefrontId)
        .select()
        .single();

      if (error) throw error;

      toast({ description: "Category added successfully" });
      setNewCategory("");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    } catch (error) {
      console.error("Error adding tag:", error);
      toast({
        variant: "destructive",
        description: "Failed to add tag",
      });
    }
  };

  const handleUpdateCategory = async (oldName: string, newName: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ category: newName.trim() })
        .eq("category", oldName);

      if (error) throw error;

      toast({ description: "Category updated successfully" });
      setEditingCategory(null);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        variant: "destructive",
        description: "Failed to update category",
      });
    }
  };

  const handleUpdateTag = async (id: string, newName: string) => {
    try {
      const { error } = await supabase
        .from("tags")
        .update({ name: newName.trim() })
        .eq("id", id);

      if (error) throw error;

      toast({ description: "Tag updated successfully" });
      setEditingTag(null);
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    } catch (error) {
      console.error("Error updating tag:", error);
      toast({
        variant: "destructive",
        description: "Failed to update tag",
      });
    }
  };

  const handleDeleteCategory = async (name: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ category: null })
        .eq("category", name);

      if (error) throw error;

      toast({ description: "Category deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete category",
      });
    }
  };

  const handleDeleteTag = async (id: string) => {
    try {
      const { error } = await supabase
        .from("tags")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ description: "Tag deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    } catch (error) {
      console.error("Error deleting tag:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete tag",
      });
    }
  };

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
            onEditStart={(name) => {
              setEditingCategory(name);
              setEditValue(name);
            }}
            onEditCancel={() => setEditingCategory(null)}
            onEditSave={handleUpdateCategory}
            onDelete={handleDeleteCategory}
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
            onEditSave={handleUpdateTag}
            onDelete={handleDeleteTag}
            onEditValueChange={setEditValue}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
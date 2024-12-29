import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Plus, X, Check } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type Category = {
  name: string;
  productCount?: number;
};

type Tag = {
  id: string;
  name: string;
  productCount?: number;
};

export const CategoryTagManagement = ({ storefrontId }: { storefrontId: string }) => {
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch categories (unique from products table)
  const { data: categories = [] } = useQuery({
    queryKey: ["categories", storefrontId],
    queryFn: async () => {
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

  // Fetch tags
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
      const { error } = await supabase
        .from("products")
        .update({ category: newCategory.trim() })
        .eq("id", "placeholder"); // This creates the category in the system

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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.name}>
                  <TableCell>
                    {editingCategory === category.name ? (
                      <div className="flex gap-2">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                        />
                        <Button
                          size="icon"
                          onClick={() => handleUpdateCategory(category.name, editValue)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setEditingCategory(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      category.name
                    )}
                  </TableCell>
                  <TableCell>{category.productCount}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setEditingCategory(category.name);
                          setEditValue(category.name);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleDeleteCategory(category.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                          onChange={(e) => setEditValue(e.target.value)}
                        />
                        <Button
                          size="icon"
                          onClick={() => handleUpdateTag(tag.id, editValue)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setEditingTag(null)}
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
                          setEditingTag(tag.id);
                          setEditValue(tag.name);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleDeleteTag(tag.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};
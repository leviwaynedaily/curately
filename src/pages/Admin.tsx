import { useAuth } from "@/contexts/AuthContext";
import { AdminLayout } from "@/layouts/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { BusinessList } from "@/components/admin/BusinessList";
import { GalleryList } from "@/components/admin/GalleryList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      console.log("Fetching user profile...");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      console.log("Profile fetched:", data);
      return data;
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
      </AdminLayout>
    );
  }

  if (!profile) {
    return (
      <AdminLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Profile not found. Please contact support.
          </AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }

  if (profile.role === "platform_admin") {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Platform Admin Dashboard</h2>
            <p className="text-muted-foreground">
              Manage all businesses and galleries
            </p>
          </div>

          <Tabs defaultValue="businesses">
            <TabsList>
              <TabsTrigger value="businesses">Businesses</TabsTrigger>
              <TabsTrigger value="galleries">Galleries</TabsTrigger>
            </TabsList>
            <TabsContent value="businesses" className="mt-6">
              <BusinessList />
            </TabsContent>
            <TabsContent value="galleries" className="mt-6">
              <GalleryList />
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    );
  }

  if (profile.role === "business_admin") {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Business Admin Dashboard</h2>
            <p className="text-muted-foreground">
              Manage your business and galleries
            </p>
          </div>

          <div className="space-y-8">
            <BusinessList />
            <GalleryList />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Your role ({profile.role}) does not have admin access.
        </AlertDescription>
      </Alert>
    </AdminLayout>
  );
};

export default Admin;
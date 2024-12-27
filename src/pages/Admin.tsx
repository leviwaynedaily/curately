import { useAuth } from "@/contexts/AuthContext";
import { AdminLayout } from "@/layouts/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Welcome!</h2>
          <p className="text-muted-foreground">
            You are logged in as: {profile.email} ({profile.role})
          </p>
        </div>

        {profile.role === "platform_admin" ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Platform Admin Dashboard</h3>
            <p>You have access to manage all businesses and galleries.</p>
          </div>
        ) : profile.role === "business_admin" ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Admin Dashboard</h3>
            <p>You have access to manage your business and its galleries.</p>
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your role ({profile.role}) does not have admin access.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </AdminLayout>
  );
};

export default Admin;
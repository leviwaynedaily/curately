import { AdminLayout } from "@/layouts/AdminLayout";

const Admin = () => {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Welcome to your admin dashboard.</p>
      </div>
    </AdminLayout>
  );
};

export default Admin;
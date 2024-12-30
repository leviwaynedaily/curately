import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";
import StorefrontView from "@/pages/StorefrontView";
import StorefrontEdit from "@/pages/StorefrontEdit";
import ProductManagement from "@/pages/ProductManagement";
import NewProductManagement from "@/pages/NewProductManagement";
import ProtectedRoute from "@/components/ProtectedRoute";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/admin/storefront/:id" element={<ProtectedRoute><StorefrontEdit /></ProtectedRoute>} />
            <Route path="/admin/storefront/new" element={<ProtectedRoute><StorefrontEdit /></ProtectedRoute>} />
            <Route path="/admin/products/:storefrontId" element={<ProtectedRoute><ProductManagement /></ProtectedRoute>} />
            <Route path="/admin/products-new/:storefrontId" element={<ProtectedRoute><NewProductManagement /></ProtectedRoute>} />
            <Route path="/storefront/:storefrontId" element={<StorefrontView />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
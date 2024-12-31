import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";
import StorefrontView from "@/pages/StorefrontView";
import ProductManagement from "@/pages/ProductManagement";
import StorefrontEdit from "@/pages/StorefrontEdit";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  console.log("App rendering, setting up routes");
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route 
              path="/admin/products/:storefrontId" 
              element={<ProtectedRoute><ProductManagement /></ProtectedRoute>} 
            />
            <Route 
              path="/admin/storefront/:storefrontId" 
              element={<ProtectedRoute><StorefrontEdit /></ProtectedRoute>} 
            />
            <Route path="/storefront/:storefrontId" element={<StorefrontView />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
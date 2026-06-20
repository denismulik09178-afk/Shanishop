import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cart-context";
import { Layout } from "@/components/Layout";
import { AdminLayout } from "@/components/AdminLayout";

// Pages
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Catalog from "@/pages/catalog";
import PerfumeDetail from "@/pages/perfume-detail";
import Cart from "@/pages/cart";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminOrders from "@/pages/admin-orders";
import AdminPerfumes from "@/pages/admin-perfumes";
import AdminCategories from "@/pages/admin-categories";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function PublicRoutes() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/catalog" component={Catalog} />
        <Route path="/perfume/:id" component={PerfumeDetail} />
        <Route path="/cart" component={Cart} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function AdminRoutes() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/orders" component={AdminOrders} />
        <Route path="/admin/perfumes" component={AdminPerfumes} />
        <Route path="/admin/categories" component={AdminCategories} />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/:any*" component={AdminRoutes} />
      <Route component={PublicRoutes} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;

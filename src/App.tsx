
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Client routes
import ClientLogin from "./pages/client/Login";
import ClientDashboard from "./pages/client/Dashboard";
import ClientInventory from "./pages/client/Inventory";
import ClientSupport from "./pages/client/Support";

// Staff routes
import StaffLogin from "./pages/staff/Login";
import StaffDashboard from "./pages/staff/Dashboard";
import StaffInventory from "./pages/staff/Inventory";
import StaffSupportTickets from "./pages/staff/SupportTickets";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          
          {/* Client routes */}
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/inventory" element={<ClientInventory />} />
          <Route path="/client/support" element={<ClientSupport />} />
          
          {/* Staff routes */}
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/inventory" element={<StaffInventory />} />
          <Route path="/staff/support-tickets" element={<StaffSupportTickets />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

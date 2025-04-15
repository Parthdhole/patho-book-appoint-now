
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Labs from "@/pages/Labs";
import Tests from "@/pages/Tests";
import Bookings from "@/pages/Bookings";
import BookingForm from "@/pages/BookingForm";
import BookingConfirmation from "@/pages/BookingConfirmation";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import RefundPolicy from "./pages/RefundPolicy";
import PartnerWithUs from "./pages/PartnerWithUs";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/booking" element={<BookingForm />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/partner" element={<PartnerWithUs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

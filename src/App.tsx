import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Seller from "./pages/Seller";
import Buyer from "./pages/Buyer";
import History from "./pages/History";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
    <GoogleOAuthProvider clientId="123391924209-nhs08cakrvmdodklsjeu2c10hg3pl061.apps.googleusercontent.com">
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/seller" element={<Seller />} />
                            <Route path="/buyer" element={<Buyer />} />
                            <Route path="/history" element={<History />} />
                            <Route path="/profile" element={<Profile />} />
                            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </TooltipProvider>
            </AuthProvider>
        </QueryClientProvider>
    </GoogleOAuthProvider>
);

export default App;
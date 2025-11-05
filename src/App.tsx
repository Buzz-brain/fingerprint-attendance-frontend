import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./components/auth/RequireAuth";
import { Layout } from "./components/layout/Layout";
import { GlobalEventListener } from "@/components/common/GlobalEventListener";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Students from "./pages/Students";
import Devices from "./pages/Devices";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <GlobalEventListener />
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Landing />} />
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/students" element={<Students />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/reports" element={<Reports />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

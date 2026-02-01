import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/app/components/ui/sonner";
import { Navigation } from "@/app/components/Navigation";
import { SalonList } from "@/app/components/SalonList";
import { SalonDetails } from "@/app/components/SalonDetails";
import { AdminPanel } from "@/app/components/AdminPanel";
import { MisCitas } from "@/app/components/MisCitas";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navigation />
        <Routes>
          <Route path="/" element={<SalonList />} />
          <Route path="/salon/:id" element={<SalonDetails />} />
          <Route path="/mis-citas" element={<MisCitas />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}
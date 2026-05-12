import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Scissors, Settings, Calendar } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { api, type ApiUsuario } from "@/services/api";

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState<ApiUsuario | null>(null);

  useEffect(() => {
    api.me().then(setUsuario).catch(() => setUsuario(null));
  }, [location.pathname]);

  const isSalon = usuario?.rol === "salon";
  const isAdmin = usuario?.rol === "admin";

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(isSalon ? "/salon-admin" : "/")}>
            <Scissors className="w-6 h-6 text-primary" />
            <span className="font-semibold text-xl">BeautyBook</span>
          </div>

          <div className="flex items-center gap-4">
            {!isSalon && (
              <Button variant={location.pathname === "/" ? "default" : "ghost"} onClick={() => navigate("/")}>Explorar Salones</Button>
            )}

            {!isSalon && (
              <Button variant={location.pathname === "/mis-citas" ? "default" : "ghost"} onClick={() => navigate("/mis-citas")}>
                <Calendar className="w-4 h-4 mr-2" />Mis Citas
              </Button>
            )}

            {isAdmin && (
              <Button variant={location.pathname === "/admin" ? "default" : "ghost"} onClick={() => navigate("/admin")}>
                <Settings className="w-4 h-4 mr-2" />Admin
              </Button>
            )}

            {isSalon && (
              <Button variant={location.pathname === "/salon-admin" ? "default" : "ghost"} onClick={() => navigate("/salon-admin")}>Mi Salon</Button>
            )}

            <Button variant={location.pathname === "/login" ? "default" : "ghost"} onClick={() => navigate("/login")}>Login</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

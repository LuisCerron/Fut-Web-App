import { LoginForm } from "@/modules/auth/components/LoginForm";
import { Trophy } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-green-house-600 via-green-house-700 to-green-house-900 p-10 text-white">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8" />
          <span className="text-2xl font-bold">Futbol Academia</span>
        </div>
        
        <div className="space-y-6">
          <blockquote className="text-xl font-medium leading-relaxed">
            "El fútbol es el deporte más hermoso del mundo. Aquí formamos campeones, dentro y fuera de la cancha."
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">Gestión Integral</p>
              <p className="text-sm text-green-house-200">Equipos, jugadores y más</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-green-house-200">
          © 2025 Futbol Academia. Todos los derechos reservados.
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-col items-center justify-center p-8 bg-background">
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <Trophy className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Futbol Academia</span>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

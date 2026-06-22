import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Loader2, Zap, Users, Trophy, Award } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && user) {
      setLocation("/game");
    }
  }, [isAuthenticated, user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Redirect in progress
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="pt-8 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-2xl text-blue-900">
                🐕
              </div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-300 via-white to-blue-200 bg-clip-text text-transparent">
                PREPOL RESET
              </h1>
            </div>
            <p className="text-blue-200 text-lg md:text-xl font-light">
              Aprende a fiscalizar el Estado mientras juegas
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Features */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  El Vigilante te enseña
                </h2>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Completa lecciones de 2 minutos, responde quizzes sobre casos reales de Ayacucho y sube de rango cívico. ¿Sabes qué hace un regidor? ¿Cómo se aprueba una obra pública? Descúbrelo jugando.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-white/10 backdrop-blur border-white/20 p-4 hover:bg-white/15 transition-colors">
                  <div className="flex items-start gap-3">
                    <Zap className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-white">Rápido</h3>
                      <p className="text-sm text-blue-100">Lecciones de 2 minutos</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-white/10 backdrop-blur border-white/20 p-4 hover:bg-white/15 transition-colors">
                  <div className="flex items-start gap-3">
                    <Users className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-white">Duelos 1v1</h3>
                      <p className="text-sm text-blue-100">Compite con amigos</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-white/10 backdrop-blur border-white/20 p-4 hover:bg-white/15 transition-colors">
                  <div className="flex items-start gap-3">
                    <Trophy className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-white">Soles Cívicos</h3>
                      <p className="text-sm text-blue-100">Gana y apuesta</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-white/10 backdrop-blur border-white/20 p-4 hover:bg-white/15 transition-colors">
                  <div className="flex items-start gap-3">
                    <Award className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-white">Certificado</h3>
                      <p className="text-sm text-blue-100">Ciudadano Reset</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Right: CTA */}
            <div className="flex flex-col items-center justify-center">
              <Card className="w-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur border-white/30 p-8 md:p-12 text-center space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-bold">
                    ¿Listo para ser un Ciudadano Reset?
                  </h3>
                  <p className="text-blue-100">
                    Inicia sesión y comienza tu viaje de aprendizaje cívico
                  </p>
                </div>

                <div className="pt-4">
                  <a href={getLoginUrl()}>
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-blue-900 font-bold text-lg h-14 rounded-lg transition-all transform hover:scale-105"
                    >
                      Iniciar Sesión con Manus
                    </Button>
                  </a>
                </div>

                <div className="text-sm text-blue-200 pt-2">
                  Tu progreso se guardará automáticamente
                </div>
              </Card>

              {/* Stats Preview */}
              <div className="mt-12 w-full grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">4</div>
                  <div className="text-sm text-blue-200">Distritos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-300">12</div>
                  <div className="text-sm text-blue-200">Niveles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-300">60</div>
                  <div className="text-sm text-blue-200">Quizzes</div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-20 py-8 px-4 border-t border-white/10">
          <div className="max-w-6xl mx-auto text-center text-blue-300 text-sm">
            <p>
              PREPOL RESET • Aprende cívica de forma interactiva • Hecho con ❤️ para ciudadanos informados
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

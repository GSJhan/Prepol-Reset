import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Loader2, LogOut, Map, Users, Trophy, Medal, Heart, Coins } from "lucide-react";
import { toast } from "sonner";

interface District {
  id: number;
  districtNumber: number;
  name: string;
  description: string | null;
  rankUnlocked: string;
}

export default function Game() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);

  const { data: districts, isLoading: districtsLoading } = trpc.game.getDistricts.useQuery();
  const { data: profile, isLoading: profileLoading } = trpc.game.getUserProfile.useQuery();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (!isAuthenticated || profileLoading || districtsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Error cargando perfil</p>
          <Button onClick={handleLogout}>Volver</Button>
        </div>
      </div>
    );
  }

  const isDistrictUnlocked = (districtNumber: number) => {
    return profile.currentDistrict >= districtNumber;
  };

  const districtColors = [
    "from-green-500 to-emerald-600",
    "from-blue-500 to-cyan-600",
    "from-purple-500 to-violet-600",
    "from-orange-500 to-red-600",
  ];

  const districtIcons = ["🏘️", "🏢", "🏛️", "🇵🇪"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-xl text-blue-900">
                🐕
              </div>
              <h1 className="text-2xl font-bold">PREPOL RESET</h1>
            </div>

            <div className="flex items-center gap-6">
              {/* Stats */}
              <div className="hidden sm:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold">{profile.solsCivicos}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  <span className="font-bold">
                    {profile.currentLives}/{profile.maxLives}
                  </span>
                </div>
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold">{profile.name}</p>
                  <p className="text-xs text-blue-300">{profile.currentRank}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation("/duel")}
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
                >
                  ⚔️
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation("/leaderboard")}
                  className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20"
                >
                  🏆
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Stats */}
          <div className="sm:hidden flex gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span>{profile.solsCivicos}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-400" />
              <span>
                {profile.currentLives}/{profile.maxLives}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Title Section */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-2">Mapa de Poder</h2>
          <p className="text-blue-200 text-lg">
            Avanza por los 4 distritos cívicos y sube de rango hasta llegar a Ciudadano Reset
          </p>
        </div>

        {/* Districts Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {districts?.map((district: District, index: number) => {
            const isUnlocked = isDistrictUnlocked(district.districtNumber);
            const isCurrentDistrict = profile.currentDistrict === district.districtNumber;

            return (
              <div
                key={district.id}
                onClick={() => isUnlocked && setSelectedDistrict(district.id)}
                className={`cursor-pointer transition-all transform ${
                  isUnlocked ? "hover:scale-105" : "opacity-50 cursor-not-allowed"
                }`}
              >
                <Card
                  className={`overflow-hidden border-2 transition-all ${
                    isCurrentDistrict
                      ? "border-yellow-400 bg-yellow-400/10"
                      : "border-white/20 bg-white/5"
                  } ${isUnlocked ? "hover:border-white/40" : ""}`}
                >
                  {/* District Header */}
                  <div
                    className={`bg-gradient-to-r ${districtColors[index]} p-6 text-white`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-5xl mb-2">{districtIcons[index]}</div>
                        <h3 className="text-2xl font-bold">{district.name}</h3>
                        <p className="text-sm text-white/80 mt-1">
                          Rango: {district.rankUnlocked}
                        </p>
                      </div>
                      {isCurrentDistrict && (
                        <Medal className="w-8 h-8 text-yellow-300" />
                      )}
                    </div>
                  </div>

                  {/* District Content */}
                  <div className="p-6">
                    <p className="text-blue-100 mb-4">
                      {district.description ||
                        "Completa los 3 niveles de este distrito para desbloquear el siguiente"}
                    </p>

                    {isUnlocked ? (
                      <Button
                        onClick={() => setSelectedDistrict(district.id)}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      >
                        {isCurrentDistrict ? "Continuar" : "Explorar"}
                      </Button>
                    ) : (
                      <Button disabled className="w-full opacity-50">
                        Bloqueado
                      </Button>
                    )}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <Card className="bg-white/10 backdrop-blur border-white/20 p-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <Medal className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-3xl font-bold">{profile.totalQuizzesCompleted}</p>
              <p className="text-sm text-blue-300">Quizzes Completados</p>
            </div>
            <div className="text-center">
              <Trophy className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <p className="text-3xl font-bold">{profile.totalDuelsWon}</p>
              <p className="text-sm text-blue-300">Duelos Ganados</p>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-3xl font-bold">{profile.streakDays}</p>
              <p className="text-sm text-blue-300">Días de Racha</p>
            </div>
            <div className="text-center">
              <Map className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-3xl font-bold">{profile.currentDistrict}/4</p>
              <p className="text-sm text-blue-300">Distritos Desbloqueados</p>
            </div>
          </div>
        </Card>
      </main>

      {/* District Detail Modal - placeholder for now */}
      {selectedDistrict && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur z-40 flex items-center justify-center p-4"
          onClick={() => setSelectedDistrict(null)}
        >
          <Card className="bg-gradient-to-br from-blue-900 to-purple-900 border-white/20 max-w-2xl w-full p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Niveles del Distrito</h3>
            <p className="text-blue-200 mb-6">
              Selecciona un nivel para comenzar a jugar
            </p>
            <Button onClick={() => setSelectedDistrict(null)} className="w-full">
              Cerrar
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Loader2, Trophy, Medal, Crown } from "lucide-react";

interface LeaderboardEntry {
  id: number;
  userId: number;
  rank: number;
  solsCivicos: number;
  currentRank: string;
  totalDuelsWon: number;
}

export default function Leaderboard() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState<"all" | "rank">("all");

  const { data: leaderboard, isLoading } = trpc.leaderboard.getTop.useQuery({ limit: 100 });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </div>
    );
  }

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "Ciudadano Reset":
        return "text-yellow-400";
      case "Gobernador de Barrio":
        return "text-purple-400";
      case "Fiscalizador Jr.":
        return "text-blue-400";
      case "Vecino Alerta":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case "Ciudadano Reset":
        return "👑";
      case "Gobernador de Barrio":
        return "🏛️";
      case "Fiscalizador Jr.":
        return "📋";
      case "Vecino Alerta":
        return "👁️";
      default:
        return "🟡";
    }
  };

  const getMedalIcon = (position: number) => {
    if (position === 1) return "🥇";
    if (position === 2) return "🥈";
    if (position === 3) return "🥉";
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <h1 className="text-3xl font-bold">Tabla de Clasificación</h1>
            </div>
            <Button
              variant="ghost"
              onClick={() => setLocation("/game")}
              className="text-blue-300 hover:text-white"
            >
              ← Volver
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => setFilter("all")}
            variant={filter === "all" ? "default" : "outline"}
            className={filter === "all" ? "bg-blue-600" : ""}
          >
            Todos
          </Button>
          <Button
            onClick={() => setFilter("rank")}
            variant={filter === "rank" ? "default" : "outline"}
            className={filter === "rank" ? "bg-blue-600" : ""}
          >
            Por Rango
          </Button>
        </div>

        {/* Leaderboard Table */}
        <Card className="bg-white/10 backdrop-blur border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Posición</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Jugador</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Rango</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Soles Cívicos</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Duelos Ganados</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard?.map((entry: LeaderboardEntry, index: number) => {
                  const medal = getMedalIcon(index + 1);
                  return (
                    <tr
                      key={entry.id}
                      className={`border-b border-white/5 transition-colors ${
                        index < 3 ? "bg-white/5 hover:bg-white/10" : "hover:bg-white/5"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {medal && <span className="text-2xl">{medal}</span>}
                          <span className="font-bold text-lg">#{index + 1}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-sm font-bold">
                            {String(entry.userId).charAt(0)}
                          </div>
                          <span>Usuario {entry.userId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getRankIcon(entry.currentRank)}</span>
                          <span className={getRankColor(entry.currentRank)}>
                            {entry.currentRank}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-yellow-300">
                          {entry.solsCivicos.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-orange-300">
                          {entry.totalDuelsWon}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/30 p-6">
            <div className="text-center">
              <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Top Jugador</h3>
              <p className="text-2xl font-bold text-yellow-300">
                {leaderboard && leaderboard.length > 0
                  ? leaderboard[0]?.solsCivicos.toLocaleString()
                  : "N/A"}
              </p>
              <p className="text-sm text-blue-200 mt-2">Soles Cívicos</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/30 p-6">
            <div className="text-center">
              <Medal className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Jugadores Activos</h3>
              <p className="text-2xl font-bold text-purple-300">
                {leaderboard?.length || 0}
              </p>
              <p className="text-sm text-blue-200 mt-2">En el ranking</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/30 p-6">
            <div className="text-center">
              <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Ciudadanos Reset</h3>
              <p className="text-2xl font-bold text-green-300">
                {leaderboard?.filter((e: LeaderboardEntry) => e.currentRank === "Ciudadano Reset")
                  .length || 0}
              </p>
              <p className="text-sm text-blue-200 mt-2">Rango máximo</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

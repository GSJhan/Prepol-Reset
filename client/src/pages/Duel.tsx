import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Loader2, Users, Swords, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function Duel() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [stage, setStage] = useState<"lobby" | "create" | "join" | "playing">("lobby");
  const [betAmount, setBetAmount] = useState(10);
  const [duelCode, setDuelCode] = useState("");
  const [createdDuelCode, setCreatedDuelCode] = useState("");
  const [copied, setCopied] = useState(false);

  const { data: profile } = trpc.game.getUserProfile.useQuery();
  const createDuelMutation = trpc.duel.createDuel.useMutation();
  const joinDuelMutation = trpc.duel.joinDuel.useMutation();
  const { data: waitingDuel } = trpc.duel.getWaitingDuel.useQuery();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </div>
    );
  }

  const handleCreateDuel = async () => {
    if (betAmount > profile.solsCivicos) {
      toast.error("No tienes suficientes Soles Cívicos");
      return;
    }

    try {
      const result = await createDuelMutation.mutateAsync({ betAmount });
      if (result && Array.isArray(result) && result.length > 0) {
        const duelCode = (result[0] as any)?.duelCode || "";
        setCreatedDuelCode(duelCode);
        setStage("create");
        toast.success("Sala de duelo creada");
      }
    } catch (error) {
      toast.error("Error al crear la sala");
    }
  };

  const handleJoinDuel = async () => {
    if (!duelCode.trim()) {
      toast.error("Ingresa un código de duelo");
      return;
    }

    try {
      await joinDuelMutation.mutateAsync({ duelCode: duelCode.toUpperCase() });
      setStage("playing");
      toast.success("¡Te uniste al duelo!");
    } catch (error) {
      toast.error("Código de duelo inválido");
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(createdDuelCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (stage === "lobby") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white p-4">
        <header className="max-w-4xl mx-auto mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/game")}
            className="text-blue-300 hover:text-white mb-4"
          >
            ← Volver
          </Button>
          <h1 className="text-4xl font-bold">Duelos Cívicos</h1>
          <p className="text-blue-200 mt-2">
            Compite contra otro jugador en tiempo real. El más rápido y preciso gana los Soles apostados.
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Create Duel */}
            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Swords className="w-6 h-6 text-orange-400" />
                <h2 className="text-2xl font-bold">Crear Duelo</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Apuesta (Soles Cívicos)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max={profile.solsCivicos}
                    value={betAmount}
                    onChange={(e) => setBetAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <p className="text-xs text-blue-300 mt-2">
                    Tienes: {profile.solsCivicos} Soles Cívicos
                  </p>
                </div>

                <Button
                  onClick={handleCreateDuel}
                  disabled={createDuelMutation.isPending}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  {createDuelMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    "Crear Sala"
                  )}
                </Button>

                <p className="text-sm text-blue-200 text-center">
                  Comparte el código con un amigo para que se una
                </p>
              </div>
            </Card>

            {/* Join Duel */}
            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur border-white/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold">Unirse a Duelo</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Código de Duelo
                  </label>
                  <Input
                    type="text"
                    placeholder="Ej: ABC123"
                    value={duelCode}
                    onChange={(e) => setDuelCode(e.target.value.toUpperCase())}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>

                <Button
                  onClick={handleJoinDuel}
                  disabled={joinDuelMutation.isPending || !duelCode.trim()}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  {joinDuelMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uniéndose...
                    </>
                  ) : (
                    "Unirse"
                  )}
                </Button>

                <p className="text-sm text-blue-200 text-center">
                  Pide el código a tu amigo
                </p>
              </div>
            </Card>
          </div>

          {/* Quick Match - Placeholder */}
          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur border-purple-400/30 p-8 mt-8">
            <h3 className="text-xl font-bold mb-2">Emparejamiento Rápido</h3>
            <p className="text-blue-200 mb-4">
              Próximamente: Búsqueda automática de oponentes
            </p>
            <Button disabled className="w-full opacity-50">
              Próximamente
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  if (stage === "create") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white flex items-center justify-center p-4">
        <Card className="bg-gradient-to-br from-blue-900 to-purple-900 border-white/20 max-w-md w-full p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Sala Creada</h2>
          <p className="text-blue-200 mb-6">
            Comparte este código con tu amigo para que se una
          </p>

          <div className="bg-white/10 border-2 border-yellow-400 rounded-lg p-4 mb-6">
            <p className="text-4xl font-bold text-yellow-300 tracking-widest">
              {createdDuelCode}
            </p>
          </div>

          <Button
            onClick={handleCopyCode}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 mb-4"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copiar Código
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={() => setStage("lobby")}
            className="w-full text-blue-300 hover:text-white"
          >
            Volver
          </Button>

          <p className="text-sm text-blue-300 mt-6">
            Esperando a que se una otro jugador...
          </p>
        </Card>
      </div>
    );
  }

  return null;
}

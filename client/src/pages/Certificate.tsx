import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useEffect, useState, useRef } from "react";
import { Loader2, Download, Share2 } from "lucide-react";
import { toast } from "sonner";

export default function Certificate() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const certificateRef = useRef<HTMLDivElement>(null);

  const { data: profile } = trpc.game.getUserProfile.useQuery();
  const { data: certificate } = trpc.certificate.getCertificate.useQuery();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (!profile || !certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    try {
      // This would require a backend endpoint to generate PDF
      // For now, we'll show a placeholder
      toast.info("Descarga de certificado en desarrollo");
    } catch (error) {
      toast.error("Error al descargar certificado");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "PREPOL RESET - Certificado Ciudadano Reset",
          text: `¡Soy un Ciudadano Reset en PREPOL RESET! ${certificate.certificateCode}`,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(certificate.certificateCode);
        toast.success("Código copiado al portapapeles");
      }
    } catch (error) {
      toast.error("Error al compartir");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white p-4">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/game")}
          className="text-blue-300 hover:text-white mb-4"
        >
          ← Volver
        </Button>
        <h1 className="text-4xl font-bold">Tu Certificado</h1>
        <p className="text-blue-200 mt-2">
          ¡Felicidades! Has alcanzado el rango de Ciudadano Reset
        </p>
      </header>

      {/* Certificate */}
      <main className="max-w-4xl mx-auto">
        <div
          ref={certificateRef}
          className="bg-gradient-to-br from-yellow-50 to-amber-50 text-gray-900 p-12 rounded-2xl shadow-2xl mb-8"
        >
          {/* Certificate Border */}
          <div className="border-4 border-yellow-600 p-8 text-center">
            {/* Header */}
            <div className="mb-8">
              <div className="text-6xl mb-4">🐕</div>
              <h2 className="text-4xl font-bold text-yellow-800 mb-2">
                PREPOL RESET
              </h2>
              <p className="text-lg text-gray-700">
                Certificado de Logro Cívico
              </p>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-yellow-600 my-8"></div>

            {/* Content */}
            <div className="my-12">
              <p className="text-gray-700 mb-4">Se certifica que</p>
              <h3 className="text-3xl font-bold text-yellow-800 mb-6">
                {profile.name || "Ciudadano"}
              </h3>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Ha completado satisfactoriamente todos los niveles de aprendizaje cívico en PREPOL RESET,
                demostrando conocimiento profundo sobre la estructura del Estado, fiscalización y participación
                ciudadana en Ayacucho, Perú.
              </p>

              <div className="bg-yellow-100 border-2 border-yellow-600 rounded-lg p-4 mb-8">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Rango Alcanzado:</strong> Ciudadano Reset
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Soles Cívicos Ganados:</strong> {profile.solsCivicos}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Código de Certificado:</strong> {certificate.certificateCode}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-yellow-600 pt-8">
              <p className="text-sm text-gray-700 mb-4">
                Emitido el {new Date(certificate.generatedAt).toLocaleDateString("es-PE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div className="flex justify-around">
                <div className="text-center">
                  <div className="w-32 h-1 border-t-2 border-yellow-600 mx-auto mb-2"></div>
                  <p className="text-xs text-gray-700">El Vigilante</p>
                </div>
                <div className="text-center">
                  <div className="w-32 h-1 border-t-2 border-yellow-600 mx-auto mb-2"></div>
                  <p className="text-xs text-gray-700">PREPOL RESET</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Button
            onClick={handleDownloadPDF}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold h-12"
          >
            <Download className="w-5 h-5 mr-2" />
            Descargar PDF
          </Button>
          <Button
            onClick={handleShare}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold h-12"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Compartir
          </Button>
        </div>

        {/* Info */}
        <Card className="bg-white/10 backdrop-blur border-white/20 p-6 mt-8">
          <h3 className="text-xl font-bold mb-4">Sobre tu Certificado</h3>
          <ul className="space-y-2 text-blue-100">
            <li className="flex items-start gap-3">
              <span className="text-yellow-400 mt-1">✓</span>
              <span>
                Tu certificado es único y verificable mediante el código QR
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-yellow-400 mt-1">✓</span>
              <span>
                Puedes descargarlo en PDF y compartirlo en redes sociales
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-yellow-400 mt-1">✓</span>
              <span>
                Demuestra tu conocimiento sobre cívica y fiscalización del Estado
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-yellow-400 mt-1">✓</span>
              <span>
                Válido para presentar en instituciones educativas y cívicas
              </span>
            </li>
          </ul>
        </Card>
      </main>
    </div>
  );
}

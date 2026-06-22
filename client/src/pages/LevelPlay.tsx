import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Loader2, Heart, Coins, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Quiz {
  id: number;
  levelId: number;
  questionNumber: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string | null;
}

interface Level {
  id: number;
  districtId: number;
  levelNumber: number;
  title: string;
  description: string | null;
  vigilanteCaseIntro: string;
  dataUnlock: string | null;
}

export default function LevelPlay() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [levelId, setLevelId] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  const { data: profile } = trpc.game.getUserProfile.useQuery();
  const { data: quizzes, isLoading: quizzesLoading } = trpc.game.getQuizzesByLevel.useQuery(
    { levelId: levelId || 0 },
    { enabled: !!levelId }
  );

  const submitQuizMutation = trpc.quiz.submitQuiz.useMutation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  if (!profile || !levelId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </div>
    );
  }

  if (quizzesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </div>
    );
  }

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="text-center">
          <p className="text-xl mb-4">No se encontraron quizzes</p>
          <Button onClick={() => setLocation("/game")}>Volver</Button>
        </div>
      </div>
    );
  }

  const currentQuiz = quizzes[currentQuestionIndex] as Quiz;
  const progress = ((currentQuestionIndex + 1) / quizzes.length) * 100;

  const handleSelectAnswer = (answer: "A" | "B" | "C" | "D") => {
    setAnswers({
      ...answers,
      [currentQuiz.id]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizzes.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit quiz
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      const quizAnswers = quizzes.map((q: Quiz) => ({
        quizId: q.id,
        selectedAnswer: answers[q.id] || "A",
      }));

      const result = await submitQuizMutation.mutateAsync({
        levelId,
        answers: quizAnswers,
      });

      setResults(result);
      setShowResults(true);

      if (result.passed) {
        toast.success(`¡Ganaste ${result.solsEarned} Soles Cívicos!`);
      } else {
        toast.error("Perdiste una vida. Intenta de nuevo mañana.");
      }
    } catch (error) {
      toast.error("Error al enviar el quiz");
    }
  };

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white flex items-center justify-center p-4">
        <Card className="bg-gradient-to-br from-blue-900 to-purple-900 border-white/20 max-w-2xl w-full p-8">
          <div className="text-center">
            {results.passed ? (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold mb-2">¡Nivel Completado!</h2>
                <p className="text-blue-200 mb-6">
                  Respondiste correctamente {results.correctCount} de {results.totalQuestions} preguntas
                </p>
                <div className="bg-yellow-400/20 border border-yellow-400 rounded-lg p-4 mb-6">
                  <p className="text-yellow-300 font-bold text-xl">
                    +{results.solsEarned} Soles Cívicos
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">😢</div>
                <h2 className="text-3xl font-bold mb-2">Nivel No Completado</h2>
                <p className="text-blue-200 mb-6">
                  Necesitas 4 respuestas correctas. Obtuviste {results.correctCount}
                </p>
                <div className="bg-red-400/20 border border-red-400 rounded-lg p-4 mb-6">
                  <p className="text-red-300 font-bold">
                    Perdiste 1 vida
                  </p>
                </div>
              </>
            )}

            <Button
              onClick={() => setLocation("/game")}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              Volver al Mapa
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const selectedAnswer = answers[currentQuiz.id];
  const isAnswered = selectedAnswer !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white p-4">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/game")}
            className="text-blue-300 hover:text-white"
          >
            ← Volver
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="font-bold">{profile.currentLives}/{profile.maxLives}</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="font-bold">{profile.solsCivicos}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/10 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-blue-300 mt-2">
          Pregunta {currentQuestionIndex + 1} de {quizzes.length}
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        {/* El Vigilante Introduction */}
        {currentQuestionIndex === 0 && (
          <Card className="bg-white/10 backdrop-blur border-white/20 p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-6xl">🐕</div>
              <div>
                <h2 className="text-2xl font-bold mb-2">El Vigilante dice:</h2>
                <p className="text-blue-100 text-lg leading-relaxed">
                  "{currentQuiz.question}"
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Quiz Card */}
        <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur border-white/20 p-8">
          <h3 className="text-2xl font-bold mb-8">{currentQuiz.question}</h3>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {(["A", "B", "C", "D"] as const).map((option) => {
              const optionText = currentQuiz[`option${option}` as keyof Quiz] as string;
              const isSelected = selectedAnswer === option;
              const isCorrect = currentQuiz.correctAnswer === option;

              return (
                <button
                  key={option}
                  onClick={() => handleSelectAnswer(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    isSelected
                      ? isCorrect
                        ? "border-green-400 bg-green-400/20"
                        : "border-red-400 bg-red-400/20"
                      : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                        isSelected
                          ? isCorrect
                            ? "border-green-400 bg-green-400 text-blue-900"
                            : "border-red-400 bg-red-400 text-white"
                          : "border-white/40"
                      }`}
                    >
                      {option}
                    </div>
                    <span className="flex-1">{optionText}</span>
                    {isSelected && isCorrect && <CheckCircle className="w-5 h-5 text-green-400" />}
                    {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswered && currentQuiz.explanation && (
            <div className="bg-blue-400/20 border border-blue-400 rounded-lg p-4 mb-8">
              <p className="text-sm text-blue-100">
                <strong>Explicación:</strong> {currentQuiz.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={!isAnswered || submitQuizMutation.isPending}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50"
          >
            {currentQuestionIndex === quizzes.length - 1 ? (
              <>
                Enviar Quiz
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Siguiente
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </Card>
      </main>
    </div>
  );
}

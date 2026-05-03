import { useState } from "react";
import { useLocation } from "wouter";
import { topics } from "@/data/topics";
import { quizzes } from "@/data/quizzes";
import { useQuizScores } from "@/hooks/useQuizScores";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";

export default function Quiz({ params }: { params: { slug: string } }) {
  const [, navigate] = useLocation();
  const slug = params.slug;
  const topic = topics.find(t => t.slug === slug);
  const quiz = quizzes[slug];
  
  const { saveScore } = useQuizScores();
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  if (!topic) {
    return <div className="text-center py-20">Topic not found</div>;
  }
  
  if (!quiz || quiz.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-serif mb-4">No quiz available for this topic yet.</h2>
        <button onClick={() => navigate(`/topic/${slug}`)} className="text-primary hover:underline">Return to reading</button>
      </div>
    );
  }

  const q = quiz[currentIdx];
  const hasAnsweredCurrent = answers[currentIdx] !== undefined;

  const handleSelect = (idx: number) => {
    if (hasAnsweredCurrent) return;
    setAnswers(prev => ({ ...prev, [currentIdx]: idx }));
  };

  const handleNext = () => {
    if (currentIdx < quiz.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Calculate score and finish
      let score = 0;
      quiz.forEach((question, idx) => {
        if (answers[idx] === question.correct) score++;
      });
      saveScore(slug, { score, total: quiz.length, date: Date.now() });
      setShowResults(true);
    }
  };

  if (showResults) {
    const score = Object.keys(answers).filter(k => answers[Number(k)] === quiz[Number(k)].correct).length;
    const pct = Math.round((score / quiz.length) * 100);
    
    return (
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="inline-block ws-badge mb-4">Quiz Complete</div>
          <h1 className="text-5xl font-serif font-bold text-foreground mb-6">{pct}% Score</h1>
          <p className="text-lg text-muted-foreground">You got {score} out of {quiz.length} correct on "{topic.title}".</p>
        </div>
        
        <div className="flex justify-center gap-4">
          <button onClick={() => navigate(`/topic/${slug}`)} className="px-6 py-3 bg-primary text-white font-bold rounded shadow hover:opacity-90">
            Return to Topic
          </button>
          <button onClick={() => { setAnswers({}); setCurrentIdx(0); setShowResults(false); }} className="px-6 py-3 bg-white border border-border text-foreground font-bold rounded hover:bg-secondary/50 flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Retry Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">{topic.title}</div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Knowledge Check</h1>
        </div>
        <div className="text-primary font-bold">
          {currentIdx + 1} / {quiz.length}
        </div>
      </div>

      <div className="w-full h-2 bg-secondary rounded-full mb-12 overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${((currentIdx + 1) / quiz.length) * 100}%` }}></div>
      </div>

      <div className="ws-card p-8">
        <h2 className="text-xl font-bold text-foreground mb-8 leading-relaxed">{q.question}</h2>
        
        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            const isSelected = answers[currentIdx] === idx;
            const isCorrect = q.correct === idx;
            const showStatus = hasAnsweredCurrent;
            
            let bgClass = "bg-white border-border hover:border-primary";
            if (showStatus) {
              if (isCorrect) bgClass = "bg-green-50 border-green-500 text-green-900";
              else if (isSelected) bgClass = "bg-red-50 border-red-500 text-red-900";
              else bgClass = "bg-white border-border opacity-50";
            } else if (isSelected) {
              bgClass = "bg-primary/10 border-primary text-primary";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={hasAnsweredCurrent}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-start gap-3 ${bgClass}`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  showStatus && isCorrect ? "border-green-500 bg-green-500" :
                  showStatus && isSelected ? "border-red-500 bg-red-500" :
                  isSelected ? "border-primary bg-primary" : "border-border"
                }`}>
                  {showStatus && isCorrect && <CheckCircle2 className="w-4 h-4 text-white" />}
                  {showStatus && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-white" />}
                </div>
                <span className="font-medium">{opt}</span>
              </button>
            );
          })}
        </div>

        {hasAnsweredCurrent && (
          <div className="mt-8 pt-6 border-t border-border animate-in fade-in">
            <div className={`p-4 rounded-lg mb-6 ${answers[currentIdx] === q.correct ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"}`}>
              <span className="font-bold mr-2">{answers[currentIdx] === q.correct ? "Correct!" : "Incorrect."}</span>
              {q.explanation}
            </div>
            <div className="flex justify-end">
              <button onClick={handleNext} className="px-6 py-2.5 bg-primary text-white font-bold rounded shadow hover:opacity-90 flex items-center gap-2">
                {currentIdx < quiz.length - 1 ? "Next Question" : "Finish Quiz"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

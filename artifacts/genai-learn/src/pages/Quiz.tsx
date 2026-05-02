import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import {
  ArrowLeft, CheckCircle2, XCircle, RotateCcw, Trophy, ChevronRight, BookOpen,
} from "lucide-react";
import { getTopicBySlug } from "@/data/topics";
import { quizzes } from "@/data/quizzes";
import { useQuizScores } from "@/hooks/useQuizScores";

const OPTION_LABELS = ["A", "B", "C", "D"];

const optionBase  = "w-full text-left flex items-start gap-3 px-4 py-3 rounded-lg border text-sm leading-snug transition-all";
const optionIdle  = `${optionBase} border-border bg-card hover:border-primary/40 hover:bg-primary/4 cursor-pointer`;
const optionRight = `${optionBase} border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 cursor-default`;
const optionWrong = `${optionBase} border-red-400 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 cursor-default`;
const optionGhost = `${optionBase} border-border/50 bg-card/60 text-muted-foreground/60 cursor-default`;

export default function Quiz() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const topic     = getTopicBySlug(slug);
  const questions = quizzes[slug] ?? [];
  const { getScore, saveScore } = useQuizScores();

  const [current,  setCurrent]  = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers,  setAnswers]  = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [done,     setDone]     = useState(false);

  if (!topic || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-xs font-mono text-muted-foreground mb-3">404</p>
          <h1 className="text-xl font-semibold mb-3">No quiz available</h1>
          <p className="text-sm text-muted-foreground mb-6">Quiz for "{slug}" hasn't been added yet.</p>
          <Link href={`/topic/${slug}`} className="text-sm text-primary hover:underline">← Back to topic</Link>
        </div>
      </div>
    );
  }

  const q       = questions[current];
  const correct = answers.filter((a, i) => a === questions[i].answer).length;

  const choose = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
  };

  const submit = () => {
    if (selected === null || revealed) return;
    const next = [...answers];
    next[current] = selected;
    setAnswers(next);
    setRevealed(true);
  };

  const advance = () => {
    if (current === questions.length - 1) {
      const finalAnswers = [...answers];
      finalAnswers[current] = selected!;
      const finalCorrect = finalAnswers.filter((a, i) => a === questions[i].answer).length;
      saveScore(slug, { score: finalCorrect, total: questions.length, date: Date.now() });
      setDone(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const retry = () => {
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setAnswers(Array(questions.length).fill(null));
    setDone(false);
  };

  /* ── Score screen ─────────────────────────────────────── */
  if (done) {
    const pct  = Math.round((correct / questions.length) * 100);
    const prev = getScore(slug);
    const improved = prev && correct > prev.score;
    return (
      <div className="min-h-screen py-16 px-5 sm:px-8 flex items-center justify-center">
        <div className="w-full max-w-md text-center fade-up">
          <div className="relative inline-flex mb-6">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold border-4 ${
              pct >= 80 ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                : pct >= 60 ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                : "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
            }`}>
              {pct}%
            </div>
            {pct === 100 && (
              <Trophy className="absolute -top-1 -right-1 w-7 h-7 text-yellow-500" />
            )}
          </div>

          <h1 className="text-2xl font-bold mb-2">
            {pct === 100 ? "Perfect score!" : pct >= 80 ? "Great work!" : pct >= 60 ? "Good effort!" : "Keep studying!"}
          </h1>
          <p className="text-sm text-muted-foreground mb-1">
            {correct} of {questions.length} correct on <span className="font-medium">{topic.title}</span>
          </p>
          {improved && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">↑ Improved from {prev!.score}/{prev!.total}!</p>
          )}

          {/* Per-question result */}
          <div className="mt-6 space-y-2 text-left mb-8">
            {questions.map((qq, i) => {
              const ans    = answers[i];
              const isCorr = ans === qq.answer;
              return (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-md border text-xs ${
                  isCorr ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10"
                         : "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10"
                }`}>
                  {isCorr
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    : <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />}
                  <span className="text-muted-foreground line-clamp-2">{qq.q}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={retry}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted transition-colors">
              <RotateCcw className="w-4 h-4" />Retry Quiz
            </button>
            <Link href={`/topic/${slug}`} className="flex-1">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <BookOpen className="w-4 h-4" />Back to Topic
              </button>
            </Link>
          </div>
          <Link href="/progress">
            <p className="mt-4 text-xs text-primary hover:underline">View all quiz scores →</p>
          </Link>
        </div>
      </div>
    );
  }

  /* ── Quiz screen ──────────────────────────────────────── */
  return (
    <div className="min-h-screen py-10 px-5 sm:px-8">
      <div className="max-w-xl mx-auto">

        {/* Back link */}
        <Link href={`/topic/${slug}`}>
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-3.5 h-3.5" />{topic.title}
          </button>
        </Link>

        {/* Header */}
        <div className="mb-6 fade-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Knowledge Check</p>
          <h1 className="text-xl font-bold">{topic.title}</h1>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mb-8 fade-up">
          {questions.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${
              i < current        ? (answers[i] === questions[i].answer ? "bg-emerald-400" : "bg-red-400")
              : i === current    ? "bg-primary flex-1"
              : "bg-border"
            }`} style={{ width: i === current ? undefined : "1.5rem" }} />
          ))}
          <span className="ml-2 text-xs tabular-nums text-muted-foreground">{current + 1}/{questions.length}</span>
        </div>

        {/* Question card */}
        <div className="mb-6 fade-up-1">
          <p className="text-base font-semibold leading-snug mb-5">{q.q}</p>

          <div className="space-y-2.5">
            {q.options.map((opt, idx) => {
              let cls = optionIdle;
              if (revealed) {
                if (idx === q.answer)  cls = optionRight;
                else if (idx === selected) cls = optionWrong;
                else                   cls = optionGhost;
              } else if (idx === selected) {
                cls = `${optionBase} border-primary bg-primary/6 cursor-pointer`;
              }
              return (
                <button key={idx} className={cls} onClick={() => choose(idx)}>
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                    revealed && idx === q.answer  ? "border-emerald-400 bg-emerald-400 text-white"
                    : revealed && idx === selected ? "border-red-400 bg-red-400 text-white"
                    : idx === selected             ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-muted"
                  }`}>
                    {OPTION_LABELS[idx]}
                  </span>
                  <span className="pt-0.5">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        {revealed && (
          <div className={`mb-6 p-4 rounded-lg border text-sm leading-relaxed fade-up ${
            selected === q.answer
              ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-900/10"
              : "border-red-200 dark:border-red-800 bg-red-50/60 dark:bg-red-900/10"
          }`}>
            <div className="flex items-center gap-2 mb-1.5">
              {selected === q.answer
                ? <><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /><span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Correct!</span></>
                : <><XCircle className="w-4 h-4 text-red-500 flex-shrink-0" /><span className="text-xs font-semibold text-red-700 dark:text-red-400">Incorrect</span></>}
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">{q.explanation}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 fade-up-2">
          {!revealed ? (
            <button
              onClick={submit}
              disabled={selected === null}
              className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
              Submit Answer
            </button>
          ) : (
            <button onClick={advance}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              {current === questions.length - 1 ? "See Results" : "Next Question"}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

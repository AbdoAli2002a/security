import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, Trophy, PlayCircle, ArrowLeft, Lightbulb } from "lucide-react";
import { quizQuestions } from "@/content/quiz-data";
import { gameFacts } from "@/content/games-data";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "اختبار المعرفة | مختبر الأمن السيبراني" },
      {
        name: "description",
        content:
          "اختبر معلوماتك في برامج وأدوات الحماية المتقدمة وإجراءات الأمان للحاسب: 20 سؤالًا عن كلمات المرور والصلاحيات وأدوات الفحص والجدار الناري والنسخ الاحتياطي والتشفير والتجزئة، مع شرح لكل إجابة.",
      },
      { property: "og:title", content: "اختبار المعرفة | مختبر الأمن السيبراني" },
      { property: "og:description", content: "20 سؤالًا تفاعليًا تغطي كل دروس المقرر مع شرح للإجابة الصحيحة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = quizQuestions[current]!;
  const total = quizQuestions.length;

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 >= total) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / total) * 100);
    const grade =
      pct >= 90
        ? { text: "خبير أمن سيبراني! 🏆", cls: "text-success" }
        : pct >= 70
          ? { text: "ممتاز — أنت محمي جيدًا! 🛡️", cls: "text-success" }
          : pct >= 50
            ? { text: "جيد — راجع الدروس مرة أخرى 📘", cls: "text-accent" }
            : { text: "تحتاج للمزيد — ابدأ من درس كلمات المرور 📗", cls: "text-destructive" };
    const fact = gameFacts[score % gameFacts.length];

    return (
      <div className="hero-glow relative min-h-[70vh]">
        <div className="cyber-grid absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-xl px-4 py-20 text-center">
          <span className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-primary/15 text-primary shadow-[var(--shadow-glow)]">
            <Trophy className="size-10" />
          </span>
          <h1 className="mt-6 text-3xl font-black">انتهى الاختبار!</h1>
          <p className="mt-4 font-latin text-5xl font-bold text-glow">
            {score} <span className="text-xl text-muted-foreground">/ {total}</span>
          </p>
          <p className={`mt-3 text-lg font-extrabold ${grade.cls}`}>{grade.text}</p>
          <div className="panel mt-8 p-5 text-sm leading-relaxed">
            <span className="inline-flex items-center gap-2 font-bold text-primary">
              <Lightbulb className="size-4" />
              معلومة تُحفظ معك
            </span>
            <p className="mt-2 text-muted-foreground">{fact}</p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={restart}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.03]"
            >
              <RotateCcw className="size-4" />
              إعادة الاختبار
            </button>
            <Link
              to="/lessons"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-extrabold transition-colors hover:bg-secondary"
            >
              مراجعة الدروس
              <ArrowLeft className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCorrect = selected === q.answer;

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <div className="max-w-2xl">
        <p className="font-latin text-xs font-bold tracking-[0.3em] text-primary">KNOWLEDGE CHECK</p>
        <h1 className="mt-3 text-3xl font-black">اختبار المعرفة</h1>
        <p className="mt-3 text-muted-foreground">
          {total} سؤالًا تغطي كل دروس المقرر — اختر الإجابة الصحيحة، وسيظهر الشرح بعد كل إجابة.
        </p>
      </div>

      {/* شريط التقدم */}
      <div className="mt-8">
        <div className="flex items-center justify-between text-sm font-bold">
          <span>السؤال {current + 1} من {total}</span>
          <span className="text-primary">النقاط: {score}</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${((current + (selected !== null ? 1 : 0)) / total) * 100}%` }} />
        </div>
      </div>

      <div className="panel mt-6 p-6 md:p-8">
        <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">{q.topic}</span>
        <h2 className="mt-4 text-lg font-extrabold leading-relaxed md:text-xl">{q.question}</h2>

        <div className="mt-6 grid gap-2.5">
          {q.options.map((opt, i) => {
            const chosen = selected === i;
            const isAnswer = i === q.answer;
            let cls = "border-border bg-secondary/40 hover:border-primary/50";
            if (selected !== null) {
              if (isAnswer) cls = "border-success bg-success/15";
              else if (chosen) cls = "border-destructive bg-destructive/15";
              else cls = "border-border opacity-60";
            }
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={selected !== null}
                className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-right text-sm font-semibold leading-relaxed transition-all ${cls}`}
              >
                <span>{opt}</span>
                {selected !== null && isAnswer && <CheckCircle2 className="size-5 shrink-0 text-success" />}
                {selected !== null && chosen && !isAnswer && <XCircle className="size-5 shrink-0 text-destructive" />}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className={`mt-5 rounded-2xl border p-5 ${isCorrect ? "border-success/30 bg-success/10" : "border-accent/40 bg-accent/10"}`}>
            <p className="font-extrabold">{isCorrect ? "إجابة صحيحة! ✅" : "إجابة غير صحيحة — إليك الشرح:"}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{q.explanation}</p>
            <button
              onClick={next}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-extrabold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              {current + 1 >= total ? "عرض النتيجة" : "السؤال التالي"}
              <ArrowLeft className="size-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <PlayCircle className="size-4 text-primary" />
        راجع الدروس في أي وقت إذا احتجت مساعدة في أي سؤال.
      </div>
    </div>
  );
}

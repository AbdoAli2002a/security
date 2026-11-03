import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { lessons } from "@/content/lessons";
import { LessonBlocks } from "@/components/lesson-blocks";
import { LessonIcon } from "@/components/lesson-icon";
import { LessonQa } from "@/components/lesson-qa";

export const Route = createFileRoute("/lessons/$slug")({
  loader: ({ params }) => {
    const lesson = lessons.find((l) => l.slug === params.slug);
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.lesson.title} | مختبر الأمن السيبراني` : "الدرس غير متاح";
    const description = loaderData?.lesson.summary ?? "الدرس غير موجود.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: LessonPage,
});

function LessonPage() {
  const { lesson } = Route.useLoaderData();
  const index = lessons.findIndex((l) => l.slug === lesson.slug);
  const prev = lessons[index - 1];
  const next = lessons[index + 1];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10">
        <Link to="/lessons" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">
          <ArrowRight className="size-4" />
          كل الدروس
        </Link>
        <div className="panel mt-5 p-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <LessonIcon icon={lesson.icon} className="size-7" />
            </span>
            <div>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-muted-foreground">{lesson.order}</span>
              <h1 className="mt-2 text-2xl font-black leading-snug md:text-3xl">{lesson.title}</h1>
              <p className="mt-1 font-latin text-sm text-muted-foreground">{lesson.enTitle}</p>
            </div>
          </div>
          <p className="mt-5 border-r-2 border-primary pr-4 leading-relaxed text-muted-foreground">{lesson.summary}</p>
        </div>
      </div>

      <article className="space-y-2">
        <LessonBlocks blocks={lesson.blocks} />
      </article>

      <nav className="mt-14 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link to="/lessons/$slug" params={{ slug: prev.slug }} className="panel group p-5 transition-colors hover:border-primary/40">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              الدرس السابق
            </span>
            <p className="mt-2 font-extrabold">{prev.title}</p>
          </Link>
        ) : (
          <div />
        )}
        {next && (
          <Link to="/lessons/$slug" params={{ slug: next.slug }} className="panel group p-5 text-left transition-colors hover:border-primary/40">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
              الدرس التالي
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            </span>
            <p className="mt-2 font-extrabold">{next.title}</p>
          </Link>
        )}
      </nav>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COURSES, COURSE_BY_SLUG } from "@/lib/content";

export function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = COURSE_BY_SLUG[slug];
  if (!course) return { title: "Course not found" };
  return { title: course.title, description: course.summary };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = COURSE_BY_SLUG[slug];
  if (!course) notFound();

  const minutes = course.lessons.reduce((a, l) => a + l.minutes, 0);
  const others = COURSES.filter((c) => c.slug !== course.slug);

  return (
    <div>
      <section className="grain border-b border-line/60">
        <div className="mx-auto max-w-7xl px-5 py-12">
          <nav className="flex items-center gap-2 text-xs text-muted">
            <Link href="/academy" className="hover:text-bone">Academy</Link>
            <span className="text-line">/</span>
            <span className="text-bone/80">{course.level}</span>
          </nav>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-bone sm:text-5xl">
            {course.title}
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted">{course.summary}</p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-xs text-muted">
            <span><span className="font-mono text-bone">{course.lessons.length}</span> lessons</span>
            <span><span className="font-mono text-bone">{minutes}</span> minutes</span>
            <span><span className="font-mono text-bone">{course.level}</span> level</span>
            <span>Instructor: <span className="text-bone/85">{course.instructor}</span></span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1.5fr_0.7fr]">
        <div>
          <h2 className="font-display text-2xl text-bone">Curriculum</h2>
          <div className="mt-5 space-y-3">
            {course.lessons.map((lesson, i) => (
              <details
                key={lesson.title}
                className="group rounded-xl border border-line bg-ink-900/50 px-5 py-4 transition hover:border-gold/30"
                open={i === 0}
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-sm font-medium text-bone">{lesson.title}</span>
                  </span>
                  <span className="shrink-0 text-[11px] text-muted">{lesson.minutes} min</span>
                </summary>
                <div className="mt-4 border-t border-line/60 pt-4 pl-8">
                  <p className="text-sm leading-relaxed text-muted">{lesson.summary}</p>
                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
                    Key takeaways
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {lesson.points.map((point) => (
                      <li key={point} className="flex gap-2 text-sm leading-relaxed text-bone/80">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-line bg-ink-900/60 p-6">
            <h2 className="font-display text-xl text-bone">What you will be able to do</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {course.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-2 text-sm leading-relaxed text-muted">
                  <span className="mt-1.5 text-up">✓</span>
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-gold/30 bg-gold/[0.05] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
              {course.slug === "reading-trends" ? "Included in free plan" : "Premium access"}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-bone/85">
              {course.slug === "reading-trends"
                ? "The foundation course is free. The remaining three are included with Premium and Institutional plans."
                : "Included with Premium and Institutional. Full lesson transcripts, worksheets and the model files are available to subscribers."}
            </p>
            <Link
              href="/pricing"
              className="mt-5 inline-block rounded-full bg-gold px-4 py-2 text-xs font-semibold text-ink-950 transition hover:bg-gold-bright"
            >
              {course.slug === "reading-trends" ? "Start free" : "Unlock all courses"}
            </Link>
          </div>

          <div className="rounded-xl border border-line bg-ink-900/70 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Instructor</p>
            <p className="mt-3 font-display text-lg text-bone">{course.instructor}</p>
            <p className="text-xs text-muted">{course.instructorRole}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Publishes on the NextWall Street research desk and teaches the same framework used in the
              daily trend scores.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-ink-900/70 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Other courses</p>
            <ul className="mt-3 space-y-3">
              {others.map((other) => (
                <li key={other.slug}>
                  <Link href={`/academy/${other.slug}`} className="group block">
                    <p className="text-sm leading-snug text-bone/90 group-hover:text-gold-bright">
                      {other.title}
                    </p>
                    <p className="mt-1 text-[11px] text-muted">
                      {other.level} · {other.lessons.length} lessons
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}

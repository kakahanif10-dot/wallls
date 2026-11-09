import type { Metadata } from "next";
import Link from "next/link";
import { COURSES, VIDEOS } from "@/lib/content";
import VideoEmbed from "@/components/video-embed";

export const metadata: Metadata = {
  title: "Academy",
  description:
    "Four courses on trend reading, crypto liquidity, meme-coin risk and portfolio construction — written by the research desk.",
};

export default function AcademyPage() {
  const totalLessons = COURSES.reduce((a, c) => a + c.lessons.length, 0);
  const totalMinutes = COURSES.reduce((a, c) => a + c.lessons.reduce((x, l) => x + l.minutes, 0), 0);

  return (
    <div>
      <section className="grain border-b border-line/60">
        <div className="mx-auto max-w-7xl px-5 py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">The Academy</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-bone sm:text-5xl">
            Learn the method, not the calls.
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted">
            A subscription gives you a view. The Academy gives you the skill to disagree with it. Four
            courses, {totalLessons} lessons and roughly {Math.round(totalMinutes / 60)} hours of
            material, written by the analysts who publish the scores.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-line/60 pt-6 text-xs text-muted">
            <span><span className="font-mono text-bone">{COURSES.length}</span> courses</span>
            <span><span className="font-mono text-bone">{totalLessons}</span> lessons</span>
            <span><span className="font-mono text-bone">{totalMinutes}</span> minutes</span>
            <span><span className="font-mono text-bone">{VIDEOS.length}</span> real videos to watch</span>
            <span><span className="font-mono text-bone">1</span> foundation course free</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-6 lg:grid-cols-2">
          {COURSES.map((course, index) => {
            const minutes = course.lessons.reduce((a, l) => a + l.minutes, 0);
            const free = index === 0;
            return (
              <Link
                key={course.slug}
                href={`/academy/${course.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-line bg-ink-900/50 p-7 transition hover:border-gold/40"
              >
                <div>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-muted">
                    <span className="text-gold">{course.level}</span>
                    <span className="text-line">·</span>
                    <span>{course.lessons.length} lessons</span>
                    <span className="text-line">·</span>
                    <span>{minutes} min</span>
                    {free && (
                      <span className="ml-auto rounded border border-up/40 px-1.5 py-0.5 text-[9px] text-up">
                        Free
                      </span>
                    )}
                  </div>
                  <h2 className="mt-3 font-display text-2xl leading-snug text-bone group-hover:text-gold-bright">
                    {course.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{course.summary}</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4">
                  <p className="text-xs text-muted">
                    {course.instructor} · {course.instructorRole}
                  </p>
                  <span className="text-sm text-muted transition group-hover:translate-x-1 group-hover:text-gold-bright">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <h2 className="mb-2 font-display text-2xl text-bone">Watch the method</h2>
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted">
          Real videos from established educators, mapped to the foundation course. Press play — they run
          right here, and every one links out to its original upload on YouTube.
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          {VIDEOS.map((video) => (
            <VideoEmbed key={video.id} video={video} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-6">
        <div className="rounded-xl border border-line bg-ink-900/40 p-7">
          <h2 className="font-display text-2xl text-bone">How we teach</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              {
                t: "Rules over opinions",
                d: "Every lesson ends in a rule you can write down and apply. No 'feel the market' mysticism.",
              },
              {
                t: "Risk before returns",
                d: "Sizing, invalidation and drawdown tolerance are taught first, because they decide survival.",
              },
              {
                t: "No signals sold as certainty",
                d: "You learn the failure modes of each indicator, including ours. That is the point.",
              },
            ].map((item) => (
              <div key={item.t} className="border-t border-line/60 pt-4">
                <p className="text-sm font-medium text-bone">{item.t}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

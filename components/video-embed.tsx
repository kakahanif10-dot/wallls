"use client";

import { useState } from "react";
import type { Video } from "@/lib/content";

export default function VideoEmbed({ video }: { video: Video }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <article className="overflow-hidden rounded-xl border border-line bg-ink-900/60">
      <div className="relative aspect-video bg-black">
        {loaded ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`}
            title={video.title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            aria-label={`Play ${video.title}`}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-ink-800 via-ink-900 to-black text-center"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 bg-gold/10 text-2xl text-gold-bright transition group-hover:scale-105 group-hover:bg-gold/20">
              ▶
            </span>
            <span className="px-6 text-sm font-medium text-bone">{video.title}</span>
            <span className="text-xs text-muted/80">
              {video.channel} · {video.minutes} min
            </span>
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-bone">{video.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">{video.note}</p>
        </div>
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-gold/50 hover:text-gold-bright"
        >
          YouTube ↗
        </a>
      </div>
    </article>
  );
}

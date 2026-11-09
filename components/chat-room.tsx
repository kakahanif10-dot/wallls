"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import LiveClock from "@/components/live-clock";

type Message = {
  id: number;
  author: string;
  body: string;
  kind: "user" | "ai";
  ts: number;
};

const POLL_MS = 2500;
const NAME_KEY = "nws-chat-name";

function peerId(): string {
  let id = localStorage.getItem("nws-chat-peer");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("nws-chat-peer", id);
  }
  return id;
}

function time(ts: number): string {
  return new Date(ts).toUTCString().slice(17, 22);
}

function initials(name: string): string {
  return name
    .replace(/[·.]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [online, setOnline] = useState(0);
  const [draft, setDraft] = useState("");
  const [name, setName] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [lastTs, setLastTs] = useState(0);
  const [mode, setMode] = useState<"live" | "unavailable">("live");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const atBottom = useRef(true);

  useEffect(() => {
    const saved = localStorage.getItem(NAME_KEY) ?? "";
    setName(saved);
    setNameDraft(saved);
  }, []);

  const poll = async (after: number) => {
    try {
      const res = await fetch(
        `/api/chat?after=${after}&limit=100&peer=${encodeURIComponent(peerId())}`,
        { cache: "no-store" },
      );
      const data = await res.json();
      if (data.mode === "unavailable") {
        setMode("unavailable");
        return;
      }
      setOnline(data.online ?? 0);
      if (Array.isArray(data.messages) && data.messages.length) {
        setMessages((prev) => {
          const lastId = prev.length ? prev[prev.length - 1].id : 0;
          const fresh = data.messages.filter((m: Message) => m.id > lastId);
          return fresh.length ? [...prev, ...fresh] : prev;
        });
        setLastTs((prev) => Math.max(prev, ...data.messages.map((m: Message) => m.ts)));
      }
    } catch {
      // Transient network failure: the next poll retries.
    }
  };

  useEffect(() => {
    poll(0);
    const id = setInterval(() => poll(Date.now() - 5 * 60_000), POLL_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && atBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const saveName = () => {
    const value = nameDraft.trim().slice(0, 24);
    if (!value) return;
    localStorage.setItem(NAME_KEY, value);
    setName(value);
    setError("");
  };

  const send = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    if (!name) {
      setError("Pick a display name first (top-right).");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: name, message: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not send. Try again.");
        return;
      }
      setDraft("");
      poll(Date.now() - 5 * 60_000);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-0 px-5 py-8 lg:flex-row lg:gap-6">
      {/* Channel + member rail */}
      <aside className="mb-4 w-full shrink-0 lg:mb-0 lg:w-60">
        <div className="rounded-xl border border-line bg-ink-900/50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            Channels
          </p>
          <p className="mt-2 rounded-md bg-ink-800 px-3 py-2 text-sm text-bone">
            <span className="text-muted">#</span> general
          </p>
          <div className="mt-4 border-t border-line/60 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              In the room
            </p>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-center gap-2 text-bone">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 text-[10px] font-bold text-gold-bright">
                  N
                </span>
                Nova <span className="rounded border border-gold/50 px-1 text-[9px] text-gold">AI MOD</span>
              </li>
              <li className="text-muted">
                <span className="font-mono text-bone">{online}</span> online now
              </li>
              {name && <li className="text-muted">You — {name}</li>}
            </ul>
            <p className="mt-4 text-[11px] leading-relaxed text-muted/70">
              Nova posts a tape brief and a one-hour prediction roughly every minute while the room is
              active. Model output, not investment advice. Links are off; keep it civil.
            </p>
          </div>
        </div>
      </aside>

      {/* Message area */}
      <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-line bg-ink-900/40">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line/70 px-5 py-3">
          <span className="text-sm font-medium text-bone">
            <span className="text-muted">#</span> general
          </span>
          <span className="hidden text-xs text-muted/70 sm:inline">
            Market tape, predictions and position sizing — with the model watching the tape.
          </span>
          <div className="ml-auto flex items-center gap-3">
            <LiveClock />
            <Link href="/" className="text-xs text-muted hover:text-bone">
              ← Back
            </Link>
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={() => {
            const el = scrollRef.current;
            if (el) atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
          }}
          className="h-[52vh] overflow-y-auto px-5 py-4 lg:h-[58vh]"
        >
          {mode === "unavailable" ? (
            <p className="py-10 text-center text-sm text-muted">
              Chat storage is not configured in this environment yet.
            </p>
          ) : messages.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">
              Welcome to #general. Say hello — Nova, the AI moderator, posts the tape brief every
              minute or so.
            </p>
          ) : (
            <ul className="space-y-4">
              {messages.map((m) => (
                <li key={m.id} className={m.kind === "ai" ? "rounded-lg border-l-2 border-gold/60 bg-gold/5 py-2 pl-3" : "pl-1"}>
                  <p className="flex flex-wrap items-baseline gap-2">
                    <span
                      className={`flex h-6 w-6 translate-y-1.5 items-center justify-center rounded-full text-[9px] font-bold ${
                        m.kind === "ai" ? "bg-gold/20 text-gold-bright" : "bg-ink-700 text-bone/80"
                      }`}
                    >
                      {initials(m.author)}
                    </span>
                    <span className={`text-sm font-medium ${m.kind === "ai" ? "text-gold-bright" : "text-bone"}`}>
                      {m.author}
                    </span>
                    {m.kind === "ai" && (
                      <span className="rounded border border-gold/50 px-1 text-[9px] text-gold">MOD</span>
                    )}
                    <span className="font-mono text-[11px] text-muted/70">{time(m.ts)} UTC</span>
                  </p>
                  <p className="mt-1 max-w-3xl whitespace-pre-wrap break-words text-sm leading-relaxed text-bone/85">
                    {m.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-line/70 px-5 py-4">
          {name ? (
            <div className="flex items-end gap-3">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={`Message #general as ${name}…`}
                rows={1}
                maxLength={300}
                className="max-h-28 flex-1 resize-y rounded-xl border border-line bg-ink-900 px-4 py-2.5 text-sm text-bone placeholder:text-muted/60 focus:border-gold/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={send}
                disabled={sending || !draft.trim()}
                className="rounded-full border border-gold/50 bg-gold/10 px-5 py-2.5 text-sm font-medium text-gold-bright transition hover:bg-gold/20 disabled:opacity-40"
              >
                {sending ? "Sending…" : "Send"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveName()}
                placeholder="Pick a display name (e.g. Alex_Trades)"
                maxLength={24}
                className="flex-1 rounded-xl border border-line bg-ink-900 px-4 py-2.5 text-sm text-bone placeholder:text-muted/60 focus:border-gold/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={saveName}
                disabled={!nameDraft.trim()}
                className="rounded-full border border-gold/50 bg-gold/10 px-5 py-2.5 text-sm font-medium text-gold-bright transition hover:bg-gold/20 disabled:opacity-40"
              >
                Join the room
              </button>
            </div>
          )}
          {error && <p className="mt-2 text-xs text-down">{error}</p>}
          <p className="mt-2 text-[11px] text-muted/60">
            Enter to send · Shift+Enter for a new line · Updating live every few seconds · {online} online
          </p>
        </div>
      </section>
    </div>
  );
}

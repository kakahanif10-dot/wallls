import type { Metadata } from "next";
import ChatRoom from "@/components/chat-room";

export const metadata: Metadata = {
  title: "Live community chat",
  description:
    "Discord-style live room with an AI moderator posting per-minute tape briefs and one-hour predictions from the trend model.",
};

export default function ChatPage() {
  return (
    <div>
      <section className="border-b border-line/60 bg-ink-900/40">
        <div className="mx-auto max-w-7xl px-5 py-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
            Community
          </p>
          <h1 className="mt-2 font-display text-3xl leading-tight text-bone">
            Live chat
          </h1>
        </div>
      </section>
      <ChatRoom />
    </div>
  );
}

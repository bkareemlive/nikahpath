"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { sendMessage, markMatchRead } from "@/lib/actions/chat";
import type { MessageRow } from "@/lib/supabase/types";

function timeOf(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function dayOf(iso: string) {
  return new Date(iso).toLocaleDateString([], {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function ChatThread({
  matchId,
  meId,
  initial,
}: {
  matchId: string;
  meId: string;
  initial: MessageRow[];
}) {
  const [messages, setMessages] = useState<MessageRow[]>(initial);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  function upsert(row: MessageRow) {
    setMessages((prev) => {
      const next = prev.some((m) => m.id === row.id)
        ? prev.map((m) => (m.id === row.id ? row : m))
        : [...prev, row];
      return next.sort((a, b) => a.created_at.localeCompare(b.created_at));
    });
  }

  // Mark whatever the other side has sent as read: on open, and again
  // whenever a fresh message from them lands while the thread is open.
  useEffect(() => {
    void markMatchRead(matchId);
  }, [matchId]);

  // Live updates for both participants
  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session) await supabase.realtime.setAuth(data.session.access_token);

      channel = supabase
        .channel(`match:${matchId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `match_id=eq.${matchId}`,
          },
          (payload) => {
            const row = payload.new as MessageRow;
            upsert(row);
            if (row.sender_id !== meId) void markMatchRead(matchId);
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "messages",
            filter: `match_id=eq.${matchId}`,
          },
          (payload) => upsert(payload.new as MessageRow),
        )
        .subscribe();
    })();

    // Safety net: poll for anything the socket missed (new messages, or
    // read receipts on ones we already have).
    const poll = setInterval(async () => {
      const { data } = await supabase
        .from("messages")
        .select("id, match_id, sender_id, body, created_at, read_at")
        .eq("match_id", matchId)
        .order("created_at", { ascending: true })
        .limit(200)
        .returns<MessageRow[]>();
      if (data) {
        setMessages((prev) => {
          const byId = new Map(prev.map((m) => [m.id, m]));
          for (const row of data) byId.set(row.id, row);
          return [...byId.values()].sort((a, b) =>
            a.created_at.localeCompare(b.created_at),
          );
        });
      }
    }, 5000);

    return () => {
      cancelled = true;
      clearInterval(poll);
      if (channel) void supabase.removeChannel(channel);
    };
  }, [matchId, meId]);

  // Keep pinned to the bottom
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function submit(formData: FormData) {
    setSending(true);
    setError(null);
    const res = await sendMessage({}, formData);
    setSending(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    if (res.message) {
      upsert(res.message);
      setDraft("");
    }
  }

  return (
    <div className="flex h-[70vh] flex-col rounded-2xl border border-line bg-white shadow-card">
      <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-5">
        {messages.length === 0 && (
          <p className="mt-8 text-center text-sm text-muted">
            No messages yet. Say salaam, and keep it purposeful and respectful.
          </p>
        )}
        {(() => {
          let lastMineIdx = -1;
          messages.forEach((m, i) => {
            if (m.sender_id === meId) lastMineIdx = i;
          });
          return messages.map((m, i) => {
            const mine = m.sender_id === meId;
            const day = dayOf(m.created_at);
            const showDay = i === 0 || dayOf(messages[i - 1].created_at) !== day;
            return (
              <div key={m.id}>
                {showDay && <p className="my-3 text-center text-xs text-muted">{day}</p>}
                <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                      mine ? "bg-primary text-white" : "border border-line bg-cream text-body"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.body}</p>
                    <p
                      className={`mt-1 text-[10px] ${mine ? "text-white/70" : "text-muted"}`}
                    >
                      {timeOf(m.created_at)}
                    </p>
                  </div>
                </div>
                {mine && i === lastMineIdx && (
                  <p className="mt-0.5 text-right text-[10px] text-muted">
                    {m.read_at ? "Read" : "Sent"}
                  </p>
                )}
              </div>
            );
          });
        })()}
      </div>

      <form action={submit} className="border-t border-line p-3">
        <input type="hidden" name="match_id" value={matchId} />
        <div className="flex items-end gap-2">
          <textarea
            name="body"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={1}
            maxLength={4000}
            placeholder="Write a message…"
            className="max-h-40 min-h-[42px] flex-1 resize-y rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={sending || draft.trim() === ""}
            className="h-[42px] shrink-0 rounded-md bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {sending ? "…" : "Send"}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
      </form>
    </div>
  );
}

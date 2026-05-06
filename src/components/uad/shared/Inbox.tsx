import { useState } from "react";
import { ChevronLeft, Paperclip, Search, Send, Phone, Video, Smile, Plus } from "lucide-react";
import { Message, Thread } from "@/data/messages";
import { cn } from "@/lib/utils";

interface Props {
  threads: Thread[];
  /** Layout: "split" (web) or "stacked" (mobile, list <-> chat) */
  variant?: "split" | "stacked";
  className?: string;
}

export const Inbox = ({ threads: initial, variant = "split", className }: Props) => {
  const [threads, setThreads] = useState(initial);
  const [activeId, setActiveId] = useState<string | null>(
    variant === "split" ? initial[0]?.id ?? null : null,
  );
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");

  const active = threads.find((t) => t.id === activeId) ?? null;

  const send = () => {
    if (!draft.trim() || !active) return;
    const msg: Message = {
      id: String(Date.now()),
      from: "me",
      text: draft.trim(),
      time: "now",
    };
    setThreads((ts) =>
      ts.map((t) =>
        t.id === active.id
          ? { ...t, messages: [...t.messages, msg], preview: msg.text, lastTime: "now" }
          : t,
      ),
    );
    setDraft("");
  };

  const openThread = (id: string) => {
    setThreads((ts) => ts.map((t) => (t.id === id ? { ...t, unread: 0 } : t)));
    setActiveId(id);
  };

  const filtered = threads.filter((t) =>
    (t.name + t.preview).toLowerCase().includes(query.toLowerCase()),
  );

  /* ---------- Stacked (mobile) ---------- */
  if (variant === "stacked") {
    if (active) {
      return (
        <div className={cn("flex h-full flex-col bg-background", className)}>
          <ChatHeader thread={active} onBack={() => setActiveId(null)} />
          <ChatBody messages={active.messages} />
          <Composer value={draft} onChange={setDraft} onSend={send} />
        </div>
      );
    }
    return (
      <div className={cn("flex h-full flex-col bg-background", className)}>
        <ListHeader query={query} onQuery={setQuery} />
        <ThreadList threads={filtered} activeId={null} onSelect={openThread} />
      </div>
    );
  }

  /* ---------- Split (web) ---------- */
  return (
    <div
      className={cn(
        "grid h-[640px] grid-cols-1 overflow-hidden rounded-2xl border border-border bg-background md:grid-cols-[320px_1fr]",
        className,
      )}
    >
      <div className="hidden flex-col border-r border-border md:flex">
        <ListHeader query={query} onQuery={setQuery} />
        <ThreadList threads={filtered} activeId={activeId} onSelect={openThread} />
      </div>
      {active ? (
        <div className="flex h-full min-h-0 flex-col">
          <ChatHeader thread={active} />
          <ChatBody messages={active.messages} />
          <Composer value={draft} onChange={setDraft} onSend={send} />
        </div>
      ) : (
        <div className="grid h-full place-items-center text-sm text-muted-foreground">
          Select a conversation
        </div>
      )}
    </div>
  );
};

const ListHeader = ({
  query,
  onQuery,
}: {
  query: string;
  onQuery: (v: string) => void;
}) => (
  <div className="border-b border-border bg-gradient-ink px-4 pb-4 pt-5 text-white">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">Chats</p>
        <h3 className="text-xl font-bold">Inbox</h3>
      </div>
      <button className="grid h-9 w-9 place-items-center rounded-full bg-brand text-primary-foreground shadow-glow-sm">
        <Plus className="h-4 w-4" />
      </button>
    </div>
    <div className="mt-3 flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 backdrop-blur">
      <Search className="h-3.5 w-3.5 text-white/60" />
      <input
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder="Search messages"
        className="flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/40"
      />
    </div>
  </div>
);

const ThreadList = ({
  threads,
  activeId,
  onSelect,
}: {
  threads: Thread[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) => (
  <div className="flex-1 overflow-y-auto p-2">
    {threads.map((t) => {
      const active = activeId === t.id;
      return (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={cn(
            "mb-1 flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition-all",
            active
              ? "bg-brand/10 ring-1 ring-brand/30"
              : "hover:bg-secondary/60",
          )}
        >
          <div className="relative">
            <div className={cn(
              "grid h-11 w-11 place-items-center rounded-2xl text-xs font-bold text-primary-foreground",
              active ? "bg-gradient-to-br from-brand to-brand-deep" : "bg-foreground text-background",
            )}>
              {t.initials}
            </div>
            {t.online && (
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-brand shadow-glow-sm" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className={cn("truncate text-sm font-semibold", active && "text-brand-deep")}>{t.name}</p>
              <span className={cn("shrink-0 text-[10px]", t.unread > 0 ? "font-bold text-brand" : "text-muted-foreground")}>
                {t.lastTime}
              </span>
            </div>
            <p className={cn(
              "mt-0.5 truncate text-xs",
              t.unread > 0 ? "font-medium text-foreground" : "text-muted-foreground",
            )}>
              {t.preview}
            </p>
            {t.room && (
              <span className="mt-1 inline-block rounded-full bg-secondary px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t.room}
              </span>
            )}
          </div>
          {t.unread > 0 && (
            <span className="grid min-h-[20px] min-w-[20px] place-items-center rounded-full bg-brand px-1.5 text-[10px] font-bold text-primary-foreground shadow-glow-sm">
              {t.unread}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

const ChatHeader = ({ thread, onBack }: { thread: Thread; onBack?: () => void }) => (
  <div className="flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
    {onBack && (
      <button
        onClick={onBack}
        className="grid h-9 w-9 place-items-center rounded-full border border-border hover:border-brand"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    )}
    <div className="relative">
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-deep text-xs font-bold text-primary-foreground">
        {thread.initials}
      </div>
      {thread.online && (
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-brand" />
      )}
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-bold">{thread.name}</p>
      <p className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
        {thread.online && <span className="h-1.5 w-1.5 rounded-full bg-brand" />}
        {thread.online ? "Online now" : thread.room ?? "Last seen recently"}
      </p>
    </div>
    <button className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-brand hover:text-brand">
      <Phone className="h-4 w-4" />
    </button>
    <button className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-brand hover:text-brand">
      <Video className="h-4 w-4" />
    </button>
  </div>
);

const ChatBody = ({ messages }: { messages: Message[] }) => (
  <div className="flex-1 space-y-2 overflow-y-auto bg-gradient-to-b from-secondary/30 to-background p-4">
    {messages.map((m) => (
      <div
        key={m.id}
        className={cn(
          "flex flex-col",
          m.from === "me" ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm shadow-xs",
            m.from === "me"
              ? "rounded-br-md bg-gradient-to-br from-brand to-brand-deep text-primary-foreground"
              : "rounded-bl-md border border-border bg-background text-foreground",
          )}
        >
          {m.text}
        </div>
        <span className="mt-0.5 px-1 text-[9px] text-muted-foreground">{m.time}</span>
      </div>
    ))}
  </div>
);

const Composer = ({
  value,
  onChange,
  onSend,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
}) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSend();
    }}
    className="flex items-center gap-2 border-t border-border bg-background/95 p-3 backdrop-blur"
  >
    <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground hover:border-brand hover:text-brand">
      <Paperclip className="h-4 w-4" />
    </button>
    <div className="flex h-11 flex-1 items-center gap-2 rounded-full border border-border bg-secondary/30 px-4 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a message…"
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      <button type="button" className="text-muted-foreground hover:text-brand">
        <Smile className="h-4 w-4" />
      </button>
    </div>
    <button
      type="submit"
      className="grid h-11 w-11 place-items-center rounded-full bg-gradient-green text-primary-foreground shadow-glow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:shadow-none"
      disabled={!value.trim()}
    >
      <Send className="h-4 w-4" />
    </button>
  </form>
);
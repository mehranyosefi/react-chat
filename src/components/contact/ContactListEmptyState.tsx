import { useId } from "react";

export default function ContactListEmptyState({ onAddContact }) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-1 flex-col items-center justify-center text-center h-full"
    >
      <div className="mb-5 grid size-20 place-items-center rounded-3xl bg-violet-500/10 ring-1 ring-inset ring-violet-400/20">
        <svg
          aria-hidden="true"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-11 text-violet-300"
        >
          <circle cx="19" cy="15" r="6" />
          <path d="M7 36v-3a9 9 0 0 1 9-9h6a9 9 0 0 1 7 3.4" />
          <path d="M36 26v12M30 32h12" />
        </svg>
      </div>

      <h2 id={headingId} className="text-lg font-semibold text-slate-100">
        No contacts yet
      </h2>

      <p className="mt-2 max-w-60 text-sm leading-6 text-slate-400">
        Add someone to find them quickly when you want to chat.
      </p>

      <button
        type="button"
        onClick={onAddContact}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-violet-700 px-5 text-sm font-medium text-white transition-colors hover:bg-violet-600 active:bg-violet-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300"
      >
        Add contact
      </button>
    </section>
  );
}

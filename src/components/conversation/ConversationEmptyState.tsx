import { useId } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { pushTab } from "../../features/tab/tabSlice";

export default function ConversationEmptyState() {
  const headingId = useId();
  //   const isSearching = query.trim().length > 0;
  const isSearching = false;
  const dispatch = useDispatch<AppDispatch>();

  function handleStartChat(): void {
    dispatch(pushTab("contacts"));
  }

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
          {isSearching ? (
            <>
              <circle cx="21" cy="21" r="10" />
              <path d="m29 29 8 8" />
            </>
          ) : (
            <>
              <path
                d="M34 23h2a6 6 0 0 1 6 6v10l-5-3h-9a6 6 0 0 1-6-6v-2"
                className="text-violet-400/50"
              />
              <path
                d="M13 8h15a7 7 0 0 1 7 7v6a7 7 0 0 1-7 7H14l-8 5V15a7 7 0 0 1 7-7Z"
                className="fill-[#211c36]"
              />
              <path d="M14 16h13M14 21h8" />
            </>
          )}
        </svg>
      </div>

      <h2 id={headingId} className="text-lg font-semibold text-slate-100">
        {isSearching ? "No matching conversations" : "No conversations yet"}
      </h2>

      <p className="mt-2 max-w-56 text-sm leading-6 text-slate-400">
        {isSearching
          ? "Try a different name or clear your search."
          : "Start a chat and your conversations will appear here."}
      </p>

      <button
        type="button"
        onClick={handleStartChat}
        // onClick={isSearching ? onClearSearch : onStartChat}
        className={`mt-5 inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300
            bg-violet-700 text-white hover:bg-violet-600 active:bg-violet-800
            ${
              isSearching
                ? "bg-white/5 text-slate-200 ring-1 ring-inset ring-white/10 hover:bg-white/10"
                : "bg-violet-700 text-white hover:bg-violet-600 active:bg-violet-800"
            }`}
      >
        {isSearching ? "Clear search" : "Start a chat"}
      </button>
    </section>
  );
}

function Test() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-background p-4 text-text">
      <div className="flex h-full max-h-[800px] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border bg-surface-secondary px-5 py-4">
          <div>
            <h1 className="text-lg font-semibold">Messenger</h1>
            <p className="text-sm text-muted">Dark Theme Preview</p>
          </div>

          <span className="rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary">
            Online
          </span>
        </header>

        {/* Chat area */}
        <main className="flex flex-1 flex-col gap-5 overflow-y-auto bg-background p-5">
          <div className="self-center rounded-full bg-surface-secondary px-4 py-1 text-xs text-muted">
            Today
          </div>

          {/* Incoming message */}
          <div className="max-w-[75%] self-start rounded-2xl rounded-bl-sm border border-border bg-message-incoming px-4 py-3">
            <p className="text-sm">Hi! How are you doing?</p>
            <span className="mt-2 block text-right text-xs text-muted">10:30</span>
          </div>

          {/* Outgoing message */}
          <div className="max-w-[75%] self-end rounded-2xl rounded-br-sm bg-message-outgoing px-4 py-3">
            <p className="text-sm">I'm doing great, thanks!</p>
            <span className="mt-2 block text-right text-xs text-muted">10:31</span>
          </div>

          <div className="max-w-[75%] self-start rounded-2xl rounded-bl-sm border border-border bg-message-incoming px-4 py-3">
            <p className="text-sm">The new dark theme looks nice!</p>
            <span className="mt-2 block text-right text-xs text-muted">10:32</span>
          </div>

          <div className="max-w-[75%] self-end rounded-2xl rounded-br-sm bg-message-outgoing px-4 py-3">
            <p className="text-sm">Thank you! I'm testing the color palette.</p>
            <span className="mt-2 block text-right text-xs text-muted">10:33</span>
          </div>
        </main>

        {/* Message input */}
        <footer className="flex items-center gap-3 border-t border-border bg-surface-secondary p-4">
          <input
            type="text"
            placeholder="Write a message..."
            className="min-w-0 flex-1 rounded-xl border border-border bg-input px-4 py-3 text-sm text-text outline-none placeholder:text-muted focus:border-primary"
          />

          <button
            type="button"
            className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Send
          </button>
        </footer>
      </div>
    </div>
  );
}

export default Test;

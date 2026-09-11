import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import BaseButton from "../BaseButton";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-5xl",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEsc = true,
}) => {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // SSR / Hydration guard
  useEffect(() => {
    setMounted(true);
  }, []);

  // Escape Key Listener
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") {
        onClose();
      }
    },
    [closeOnEsc, onClose],
  );

  // Scroll Locking & Focus Management
  useEffect(() => {
    if (!isOpen) return;

    // Save previous active element to restore focus on close
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Add keyboard listener
    window.addEventListener("keydown", handleKeyDown);

    // Initial focus on modal
    modalRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, handleKeyDown]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`relative z-10 w-full ${sizeClasses[size]} rounded-xl p-6 transition-all focus:outline-none dark:bg-zinc-900 animate-in fade-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Body */}
        <div className="rounded-xl bg-gray-900/80 p-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-4">
            {title && (
              <h3
                id="modal-title"
                className="text-lg font-semibold text-white"
              >
                {title}
              </h3>
            )}
            <BaseButton emitOnClick={()=>onClose()} className="bg-transparent hover:text-purple-500" paddingX="px-2" paddingY="py-1">
                <span className="text-2xl leading-none">&times;</span>
            </BaseButton>
          </div>
          {children}
        </div>
      </div>
    </div>,
    document.getElementById("portals")!,
  );
};

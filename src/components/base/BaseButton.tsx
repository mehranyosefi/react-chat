import { useNavigate } from "react-router"; // Use useNavigate for client-side navigation
import { ReactNode } from "react";

// 1. Define supported color variants
export type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "outline" | "none";
export interface BaseButtonProps {
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  emitOnClick?: () => void;
  to?: string;
  prepend?: ReactNode;
  append?: ReactNode;
  children: ReactNode;
  className?: string;
  paddingY?: string;
  paddingX?: string;
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-gray-700 hover:bg-gray-800 text-white",
  secondary: "bg-zinc-700 hover:bg-zinc-800 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  success: "bg-emerald-600 hover:bg-emerald-700 text-white",
  outline: "bg-transparent border border-zinc-300 hover:bg-purple-500 text-white",
  none: "",
};

function BaseButton({
  type = "button",
  isLoading = false,
  emitOnClick,
  to,
  prepend,
  append,
  children,
  className = "",
  paddingY = "py-2",
  paddingX = "px-12",
  variant = "primary",
}: BaseButtonProps) {
  const navigate = useNavigate();

  function handleClick() {
    if (isLoading) return;
    if (to) {
      navigate(to); // Note: react-router redirect() is for loaders/actions, useNavigate is for event handlers
    } else {
      emitOnClick?.();
    }
  }

  const buttonClassName = `
    ${paddingY} ${paddingX} 
    ${variantClasses[variant]} 
    rounded-xl cursor-pointer transition-colors duration-300 text-sm font-medium
    disabled:opacity-60 disabled:cursor-not-allowed
    ${className}
  `.trim().replace(/\s+/g, " ");

  return (
    <button
      className={buttonClassName}
      type={type}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="loader">Loading...</div>
      ) : (
        <div className="inline-flex items-center justify-center gap-2">
          {prepend}
          {children}
          {append}
        </div>
      )}
    </button>
  );
}

export default BaseButton;

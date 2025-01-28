import React, { ReactNode } from "react";

export interface BaseInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  model?: string | Array<any>;
  updateModel?: (val: any) => void;
  type?: string;
  label?: string;
  value?: string | number;
  checked?: boolean;
  errorMessage?: string;
  prepend?: ReactNode;
  append?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export interface BaseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: "button" | "submit" | "reset";
  bg?: string;
  isLoading?: boolean;
  to?: string;
  prepend?: ReactNode;
  append?: ReactNode;
  children?: ReactNode;
  className?: string;
  emitOnClik?: () => void;
}

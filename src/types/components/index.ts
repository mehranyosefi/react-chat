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

export interface ChatItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 id: string
  name: string;
  contactId: string;
  createdAt : string;
  onDelete: (id:string) => void;
  isLast: boolean;
  handleRefreshItem: ()=>void;
}

export interface MessageType {
  id: string | number;
  chat_username: string;
  content: string;
  created_at: string;
  updated_at: string | null;
}

export interface EditContactFormProps {
  id: string;
  currentName: string;
  handleClose: () => void;
  handleRefreshItems: () => void;
}

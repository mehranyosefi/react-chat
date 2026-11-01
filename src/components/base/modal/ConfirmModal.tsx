import BaseButton from "../BaseButton";
import { BaseModal } from "./BaseModal";

type ConfirmModalProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

function ConfirmModal({
  isOpen,
  title = "Delete message",
  message,
  confirmText = "delete",
  cancelText = "Cancel",
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-gray-300 pb-5">{message}</p>

      <div className="flex justify-end gap-x-2">
        <BaseButton
          className="hover:bg-gray-700 text-gray-300"
          variant="none"
          paddingX="px-4"
          paddingY="py-2"
          emitOnClick={onClose}
        >
          {cancelText}
        </BaseButton>
        <BaseButton
          variant="danger"
          paddingX="px-4"
          paddingY="py-2"
          isLoading={isLoading}
          emitOnClick={onConfirm}
        >
          {confirmText}
        </BaseButton>
      </div>
    </BaseModal>
  );
}

export default ConfirmModal;

import { FormEvent, useRef, useState } from "react";
import { updateContact } from "../../services/contact/contact.api";
import { useOutsideClick } from "../../features/hooks/useOutsideClick";
import { EditContactFormProps } from "../../types/components";
import BaseButton from "../base/BaseButton";
import BaseInput from "../base/BaseInput";

function EditContactForm(props: EditContactFormProps) {
  const {
    id,
    currentName,
    handleClose,
    handleRefreshItems,
  } = props;

  const formModel = useRef(null);
  const [loading, setLoading] = useState(false);

  useOutsideClick(formModel, () => handleClose());

  async function handleEditContact(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "");

    try {
      await updateContact(id, { name });

      handleRefreshItems();
      handleClose();
    } catch (error) {
      console.error("Error updating contact:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="create-form">
      <div className="create-form__container">
        <form
          onSubmit={handleEditContact}
          className="flex flex-col gap-y-7"
          ref={formModel}
        >
          <div className="create-form__body flex flex-col gap-y-5">
            <div className="flex gap-x-2">
              <BaseInput
                label="name"
                name="name"
                defaultValue={currentName}
                className="flex gap-x-4 w-full"
                required
              />
            </div>
          </div>

          <div className="create-form__footer flex gap-x-5 justify-around">
            <BaseButton
              type="submit"
              isLoading={loading}
              className="flex-1 min-w-0"
            >
              SAVE
            </BaseButton>

            <BaseButton
              emitOnClick={handleClose}
              variant="outline"
              className="flex-1 min-w-0"
            >
              CANCEL
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditContactForm;
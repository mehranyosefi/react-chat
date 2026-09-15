import { useRef, useState, FormEvent } from "react";
import { createContact } from "../../services/contact/contact.api";
import { useOutsideClick } from "../../features/hooks/useOutsideClick";
import BaseButton from "../base/BaseButton";
import BaseInput from "../base/BaseInput";

function CreateContactForm(props: {
  handleClose: () => void;
  handleRefreshItems?: () => void;
}) {
  const { handleClose, handleRefreshItems } = props;
  const formModel = useRef(null);
  useOutsideClick(formModel, () => handleClose());
  const [loading, setLoading] = useState(false);

  async function handleCreateContact(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");

    try {
      await createContact({ name, email });
      await handleRefreshItems?.();
      handleClose();
    } catch (error) {
      console.error("Error creating contact:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="create-form">
      <div className="create-form__container">
        <form
          onSubmit={handleCreateContact}
          className={` flex flex-col gap-y-7
                `}
          ref={formModel}
        >
          <div className="create-form__body flex flex-col gap-y-5">
            <div className="flex gap-x-2">
              <BaseInput
                label="name"
                name="name"
                className="flex gap-x-4 w-full"
              />
            </div>
            <div className="flex gap-x-2">
              <BaseInput
                label="email"
                name="email"
                type="email"
                className="flex gap-x-4 w-full"
                required
              />
            </div>
          </div>
          <div className="create-form__footer flex gap-x-5 justify-around">
            <BaseButton type="submit" isLoading={loading} className="grow">
              DONE
            </BaseButton>
            <BaseButton
              emitOnClick={handleClose}
              variant="outline"
              className="grow"
            >
              CANCEL
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateContactForm;

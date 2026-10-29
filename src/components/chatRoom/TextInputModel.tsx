import { KeyboardEvent, useEffect, useState } from "react";
import BaseInput from "../base/BaseInput";
import BaseButton from "../base/BaseButton";

function TextInputModel(props: {
  emitValue: (val: string) => void;
  classes?: string;
  editValue?: string;
  onCancel?: () => void;
}) {
  const { emitValue, classes = "", editValue = "", onCancel } = props;
  const [model, updateModel] = useState<string>("");

  function sendMessage(): void {
    if (!model) return;
    emitValue(model);
    updateModel("");
  }

  useEffect(() => {
    updateModel(editValue);
  }, [editValue]);
  function handleKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (e.key === "Enter") sendMessage();
    if (e.key === "Escape") onCancel?.();
  }
  return (
    <div className="text-input-model flex items-center gap-x-2 mb-7">
      <div
        className={`rounded-3xl rounded-br-none px-4 py-0 flex items-center gap-x-1 bg-gray-800 ${classes}`}
      >
        <svg className="size-6 cursor-pointer text-gray-300 hover:text-purple-500 transition duration-300">
          <use className="size-6" href="/img/icons.svg#iconoir-emoji"></use>
        </svg>
        {/* <input type="text" onInput={(e) => } className="grow border-none outline-none py-2 m-2 pl-2" placeholder="Message" /> */}
        <BaseInput
          onKeyDown={handleKeyDown}
          model={model}
          updateModel={(val: string) => updateModel(val)}
          className="text-input-model__input"
        />
        <svg className="size-6 cursor-pointer text-gray-300 hover:text-purple-500 transition duration-300">
          <use className="size-6" href="/img/icons.svg#attachment-light"></use>
        </svg>
      </div>
      <BaseButton
        disabled={model ? false : true}
        emitOnClick={sendMessage}
        type="button"
        className="size-14 bg-gray-900/80 text-purple-400 hover:text-white hover:bg-purple-500 transition-colors duration-300
     disabled:opacity-70 disabled:hover:bg-gray-900/80 disabled:text-purple-500 flex items-center justify-center pr-1"
        rounded="rounded-full"
        paddingX="px-2"
      >
        <svg className="size-7">
          <use className="size-7" href="/img/icons.svg#fluent-send"></use>
        </svg>
      </BaseButton>
    </div>
  );
}
export default TextInputModel;

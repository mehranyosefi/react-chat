import { KeyboardEvent, useState } from "react";
import BaseInput from "../base/BaseInput";

function TextInputModel(props: { emitValue: (val: string) => void, classes?: string, }) {
    const { emitValue, classes = '' } = props;
    const [model, updateModel] = useState<string>('');

    function sendMessage(): void {
        if (!model) return
        emitValue(model)
        updateModel('')
    }
    function handleKeyDown(e: KeyboardEvent<HTMLElement>) {
        if (e.key === "Enter") sendMessage()
    }
    return (
        <div className="text-input-model flex items-center gap-x-2 mb-7">
            <div className={`rounded-3xl rounded-br-none px-4 py-0 flex items-center gap-x-1 bg-gray-900/80 ${classes}`}>
                <svg className="size-6 cursor-pointer text-gray-300 hover:text-purple-500 transition duration-300"><use className="size-6" href="/img/icons.svg#iconoir-emoji"></use></svg>
                {/* <input type="text" onInput={(e) => } className="grow border-none outline-none py-2 m-2 pl-2" placeholder="Message" /> */}
                <BaseInput onKeyDown={handleKeyDown} model={model} updateModel={(val: string) => updateModel(val)}
                    className="text-input-model__input" />
                <svg className="size-6 cursor-pointer text-gray-300 hover:text-purple-500 transition duration-300"><use className="size-6" href="/img/icons.svg#attachment-light"></use></svg>
            </div>
            <button disabled={model ? false : true}
                onClick={sendMessage}
                type="button" className="btn__action">
                <svg className="size-7 ml-4">
                    <use className="size-7" href="/img/icons.svg#fluent-send"></use>
                </svg>
            </button>
        </div>
    )
}
export default TextInputModel
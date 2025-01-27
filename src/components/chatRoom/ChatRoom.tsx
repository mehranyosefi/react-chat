import { useState } from "react";
import { useSelector } from "react-redux";

function ChatRoom() {
    const [messages, updateMessages] = useState<Array<string>>([]);
    const { email } = useSelector((store) => store.user)
    function handleSendMessage(val: string) {
        updateMessages([
            ...messages,
            val
        ])
    }
    return (
        <div className="flex flex-col justify-between h-full">
            <div className="flex items-center justify-between px-5 py-3 bg-gray-900/80 shadow-md">
                <div className="flex gap-x-4">
                    <img className="size-12 rounded-full" src="" alt="" />
                    <div className="flex flex-col gap-y-2">
                        <span>نام</span>
                        <span className="text-xs">state</span>
                    </div>
                </div>
                <div className="flex gap-x-4">
                    <svg className="size-7 text-gray-300 hover:text-white transition-all duration-300 cursor-pointer">
                        <use className="size-7" href="/img/icons.svg#search-rounded"></use>
                    </svg>
                    <svg className="size-7 text-gray-300 hover:text-white transition-all duration-300 cursor-pointer">
                        <use className="size-7" href="/img/icons.svg#outline-call"></use>
                    </svg>
                    <svg className="size-7 text-gray-300 hover:text-white transition-all duration-300 cursor-pointer">
                        <use className="size-7" href="/img/icons.svg#options-vertical"></use>
                    </svg>
                </div>
            </div>
            <div className="grow">
                {messages}
            </div>
            <div className="mx-auto">
                <TextInputModel classes="w-[30rem]" emitValue={handleSendMessage}></TextInputModel>
            </div>
        </div>
    );
}

export default ChatRoom;



function TextInputModel(props: { emitValue: (val: string) => void, classes?: string, }) {
    const { emitValue, classes = '' } = props;
    const [model, updateModel] = useState<string>('');

    function sendMessage(): void {
        if (!model) return
        emitValue(model)
    }

    return (
        <div className="flex items-center gap-x-2 mb-7">
            <div className={`rounded-3xl rounded-br-none px-4 py-0 flex items-center bg-gray-900/80 ${classes}`}>
                <svg className="size-6 cursor-pointer text-gray-300 hover:text-purple-500 transition duration-300"><use className="size-6" href="/img/icons.svg#iconoir-emoji"></use></svg>
                <input type="text" onInput={(e) => updateModel((e.target as HTMLInputElement).value)} className="grow border-none outline-none py-2 m-2 pl-2" placeholder="Message" />
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
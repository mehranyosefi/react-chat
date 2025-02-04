import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useOutsideClick } from "../../features/hooks/useOutsideClick";
import { supabase } from "../../services/supbase";
import BaseButton from "../base/BaseButton";
import BaseInput from "../base/BaseInput";

function ChatAddMenu(props: { handleCloseModal: () => void, handleRefreshItems: () => void }) {
    const { handleCloseModal, handleRefreshItems } = props;
    const modal = useRef(null)
    const { session } = useSelector(store => store.user)
    useOutsideClick(modal, () => handleCloseModal())
    const [loading, setLoading] = useState(false)

    async function createContact(e: FormEvent) {
        console.log(session)
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.target as HTMLFormElement)
        //TODO set Validation
        const { name, username } = Object.fromEntries(formData)

        const { error, status } = await supabase
            .from('chat')
            .insert({ name, username, user_token: session.access_token })
        if (!error && status === 201) {
            handleRefreshItems()
            handleCloseModal()
        }
        setLoading(false)
    }
    return (
        <div className="modal">
            <div className="modal__container h-screen w-full flex items-center justify-center">
                <form onSubmit={createContact} className={`w-[25rem] rounded-xl bg-gray-900/80 p-5 flex flex-col gap-y-7
                `}
                    ref={modal}>
                    <div className="modal__header">
                        <span className="text-2xl">New Contact</span>
                    </div>
                    <div className="modal__body flex flex-col gap-y-5">
                        <div className="flex gap-x-2">
                            <BaseInput label="name" name="name" className="flex gap-x-4 w-full" />
                        </div>
                        <div className="flex gap-x-2">
                            <BaseInput label="username" name="username" className="flex gap-x-4 w-full" />
                        </div>
                    </div>
                    <div className="modal__footer flex gap-x-5 justify-around">
                        <BaseButton type="submit" isLoading={loading}>DONE</BaseButton>
                        <BaseButton emitOnClik={handleCloseModal} className="btn__outline">CANCEL</BaseButton>
                    </div>
                </form>
            </div>
        </div>
    )
}


export default ChatAddMenu;
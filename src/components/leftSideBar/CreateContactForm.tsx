import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useOutsideClick } from "../../features/hooks/useOutsideClick";
import { supabase } from "../../services/supbase";
import BaseButton from "../base/BaseButton";
import BaseInput from "../base/BaseInput";

function ChatAddMenu(props: { handleClose: () => void, handleRefreshItems: () => void }) {
    const { handleClose, handleRefreshItems } = props;
    const formModel = useRef(null)
    const { session } = useSelector(store => store.user)
    useOutsideClick(formModel, () => handleClose())
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
            handleClose()
        }
        setLoading(false)
    }
    return (
        <div className="create-form">
            <div className="create-form__container">
                <form onSubmit={createContact} className={` flex flex-col gap-y-7
                `}
                    ref={formModel}>
                    <div className="create-form__body flex flex-col gap-y-5">
                        <div className="flex gap-x-2">
                            <BaseInput label="name" name="name" className="flex gap-x-4 w-full" />
                        </div>
                        <div className="flex gap-x-2">
                            <BaseInput label="username" name="username" className="flex gap-x-4 w-full" />
                        </div>
                    </div>
                    <div className="create-form__footer flex gap-x-5 justify-around">
                        <BaseButton type="submit" isLoading={loading} className="grow">DONE</BaseButton>
                        <BaseButton emitOnClick={handleClose} variant="outline" className="grow">CANCEL</BaseButton>
                    </div>
                </form>
            </div>
        </div>
    )
}


export default ChatAddMenu;
import { Link } from "react-router"
import { CahtItemProps } from "../../types/components"

function ChatItem(props: CahtItemProps) {
    const { name, username, created_at } = props

    function toLocale() {
        return new Date(created_at).toLocaleDateString('fa-IR')
    }
    return (
        <Link to={username} className="flex transition-colors 50 hover:bg-gray-600/40 gap-3 rounded-md p-2">
            <div className="size-16 bg-gray-800 rounded-full flex items-center justify-center">
                <svg className="size-10">
                    <use className="size-810" href="/img/icons.svg#avatar-line"></use>
                </svg>
            </div>
            <div className="flex flex-col gap-y-3 flex-nowrap grow">
                <div className="flex justify-between items-center grow">
                    <span className="font-bold">{name}</span>
                    <span className="text-xs pr-2">{toLocale()}</span>
                </div>
                <p className="text-sm truncate max-w-60 overflow-hidden">Lorem ipsum dolor sit amet sfesefgfegdddsss</p>
            </div>
        </Link>
    )
}

export default ChatItem;
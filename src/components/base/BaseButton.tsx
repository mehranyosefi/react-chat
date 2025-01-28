import { redirect } from "react-router";
import { BaseButtonProps } from "../../types/components";

function BaseButton(props: BaseButtonProps) {
    const { type = 'button', bg = 'bg-gray-800/90', isLoading = false, emitOnClik, to, prepend, append, children, className = '' } = props;

    function handleClik() {
        if (to) redirect(to)
        else emitOnClik?.()
    }
    return (
        <button className={`btn py-2 px-12 rounded-xl cursor-pointer transition-colors duration-300 hover:bg-gray-900/80
            ${bg} ${className}
            `}
            type={type}
            onClick={handleClik}
            disabled={isLoading}
        >
            {
                isLoading ? <div className="loader"></div>
                    : <>
                        {prepend && prepend}
                        {children}
                        {append && append}
                    </>
            }

        </button>
    );
}

export default BaseButton;
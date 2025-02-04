import { useState } from "react";
import { BaseInputProps } from "../../types/components";

function BaseInput(props: BaseInputProps) {
    const { model, updateModel, type = 'text', label = '', value = '', checked = false, errorMessage = '',
        children, prepend = null, append = null, className = '', ...rest } = props;
    const [active, setActive] = useState<boolean>(false);

    function handleUpdateModel(val: string | number | boolean) {
        updateModel?.(val)
    }

    return (
        <div className={`input ${className}`}>
            <label className="input__label">{label}
            </label>
            <div className={`input__scaffold flex items-center border border-gray-400 hover:border-purple-400 rounded-xl duration-300 grow
            ${(active && !(type === 'radio' || type === 'checkbox')) && 'input__scaffold--active border-purple-500 outline outline-purple-500'}
             ${errorMessage && 'input__scaffold--inValid border-red-500'}
             ${(type === 'radio' || type === 'checkbox') && 'accent-purple-500 border-none'}
            `}
                onBlur={() => setActive(false)}
                onFocus={() => setActive(true)}
            >
                {prepend && prepend}
                {
                    children ? children :
                        type == 'radio' ?
                            <input
                                type={type}
                                value={value}
                                onChange={() => handleUpdateModel(value!)}
                                checked={model === value}
                                className="outline-none"
                                {...rest}
                            />
                            :
                            type === 'checkbox' ?
                                <input
                                    type={type}
                                    value={value}
                                    onChange={() => handleUpdateModel(value)}
                                    checked={checked}
                                    className="outline-none"
                                    {...rest}
                                />
                                :
                                <input
                                    type={type}
                                    value={model}
                                    onInput={(e) => handleUpdateModel((e.target as HTMLInputElement).value)}
                                    className="outline-none p-2 grow rounded-xl text-sm"
                                    {...rest}
                                />

                }
                {append && append}
            </div>
        </div>
    );
}

export default BaseInput;

/* example for use
//for radio input
<BaseInput model={model} updateModel={(val: string) => triggerUpdateModel(val)} type="radio" label="name" value="name" />

//for checkbox input
<BaseInput updateModel={(val: boolean) => triggerUpdateModel(val)} type="radio" label="name" value="name" />

//and for etc..
<BaseInput model={model} updateModel={(val: string) => triggerUpdateModel(val)} type="password" label="password" />
*/
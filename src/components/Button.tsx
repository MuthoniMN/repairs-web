import React from "react";
import { dmSans } from "../assets/fonts";

export default function Button({ text, icon, event, classNames, disabled, type = 'default' }: {
    text?: string,
    icon?: React.ReactElement,
    type?: 'default' | 'secondary' | 'success' | 'error'
    /* eslint-disable @typescript-eslint/no-explicit-any */
    event?: (e: any) => void,
    classNames?: string,
    disabled?: boolean
}) {
    return (
        <button className={`
        py-2 px-4 rounded-md transition-all ease-in-out flex gap-2 justify-center items-center
            ${type == 'secondary' ? 'border-2 border-cyan-500 text-cyan-700 bg-white hover:bg-cyan-50' :
                type == 'success' ? 'bg-emerald-500 text-white hover:bg-emerald-500/50' :
                    type == 'error' ? 'bg-red-500 text-white hover:bg-red-500/30' :
                        'bg-cyan-700 text-white hover:bg-cyan-500'
            }
            ${classNames}
        `} onClick={event} disabled={disabled}>
            {icon}
            {text && <p className={`${dmSans.className}`}>{text}</p>}
        </button>
    )
}
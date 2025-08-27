import { AlertCircle } from "lucide-react";
import { dmSans } from "../assets/fonts";
import { HTMLInputTypeAttribute } from "react";

export default function InputContainer({ value, setValue, label, placeholder, onEnter, helperText, err, large = false, type = 'text', disabled = false }: {
    value: string | number,
    setValue: (txt: string | number) => void,
    label: string,
    placeholder: string,
    large?: boolean,
    type?: HTMLInputTypeAttribute,
    onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    disabled?: boolean,
    helperText?: string,
    err?: string,
}) {
    return (
        <div className="flex flex-col gap-2 text-black">
            <label className={`${dmSans.className} font-medium`}>{label}</label>
            {
                !large ?
                    (<input
                        type={label == 'Password' ? 'password' : type}
                        value={value}
                        placeholder={placeholder}
                        className={`py-2 px-4 bg-slate-50 ${dmSans.className}`}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={onEnter}
                        disabled={disabled}
                    />) : (
                        <textarea
                            rows={4}
                            value={value}
                            placeholder={placeholder}
                            onChange={(e) => setValue(e.target.value)}
                            className={`py-2 px-4 bg-slate-50 ${dmSans.className}`}
                        />
                    )}
            {
                helperText && (<p className="text-xs italic">{helperText}</p>)
            }
            {
                err && (<div className="py-2 px-4 bg-red-50 text-red-500 flex items-center gap-2">
                    <AlertCircle />
                    <p>{err}</p>
                </div>)
            }
        </div>
    );
}
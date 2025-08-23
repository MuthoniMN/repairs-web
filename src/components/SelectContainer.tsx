import { useState } from "react";
import { dmSans } from "../assets/fonts";
import { Check } from "lucide-react";

type TOptionsList = {
    text: string,
    value: string
}

export default function SelectContainer({ value, setValue, label, placeholder, options, multiSelect = false }: {
    value: any,
    setValue: (txt: any) => void,
    label: string,
    placeholder: string,
    options: TOptionsList[] | any,
    multiSelect?: boolean
}) {
    const [selected, setSelected] = useState<string | string[]>('')

    const handleChange = (val: string) => {
        if (!multiSelect) {
            setValue(val);
            setSelected(val)
            return;
        }
        setSelected([...selected, val])
        setValue([...selected, val])
    }
    return (
        <div className="flex flex-col gap-2 text-black">
            <label className={`${dmSans.className} font-medium`}>{label}</label>
            <select className={`py-2 px-4 bg-slate-50 ${dmSans.className}`} defaultValue={value} onChange={(e) => handleChange(e.target.value)} multiple={multiSelect}>
                <option className={`py-2 px-4 bg-slate-50 ${dmSans.className}`}>{placeholder}</option>
                {options.map(opt => (
                    <option
                        className={`py-2 px-4 bg-slate-50 ${dmSans.className}`}
                        key={opt.value || opt.id}
                        value={opt.value || opt.id}>
                        <p>{opt.text || opt.title || opt.company}</p>
                        {value == opt.value || value.includes(opt.id) && (<Check size={18} color="#22B822" />)}
                    </option>
                ))}
            </select>
        </div>
    );
}
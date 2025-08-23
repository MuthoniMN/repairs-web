import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { dmSans } from "../assets/fonts";
import Button from "./Button";
import { X } from "lucide-react";

export default function Modal({ children, open, title, setOpen }: Readonly<{
    children: React.ReactNode;
    open: boolean,
    title: string,
    setOpen: Dispatch<SetStateAction<boolean>>
}>) {
    const modalRef = useRef<HTMLDivElement>(null);

    // close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
        <div className={`absolute top-0 left-0 right-0 bottom-0 z-10 bg-black/30 flex justify-center items-center ${dmSans.className} ${open ? 'block' : 'hidden'}`} ref={modalRef}>
            <div className="bg-white p-8 rounded-md md:min-w-xl min-h-2xl md:w-2/5 w-9/10 h-3/4 overflow-y-scroll overflow-x-hidden z-48">
                {/* header */}
                <div className="flex justify-between items-center py-2">
                    <h1 className={`${dmSans.className} text-xl font-bold text-black text-center`} >
                        {title}
                    </h1>
                    <Button
                        icon={<X size={16} color="#000" />}
                        event={() => setOpen(false)}
                        type="secondary"
                    />
                </div>
                {children}
            </div>
        </div>
    );
}
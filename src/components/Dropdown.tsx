"use client";
import { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";

interface DropdownProps {
    actions: { label: string; onClick: () => void }[];
}

export default function Dropdown({ actions }: DropdownProps) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="p-2 rounded hover:bg-gray-100"
            >
                <MoreHorizontal className="w-5 h-5" />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                    {actions.map((action, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                action.onClick();
                                setOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

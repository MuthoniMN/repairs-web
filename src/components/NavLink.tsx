'use client';

import { usePathname } from 'next/navigation';
import Link from "next/link";
import { adminLinks } from "./Sidebar";
import { useEffect, useState } from 'react';
import { dmSans } from '../assets/fonts';

export default function NavLink({ link }: { link: typeof adminLinks[3] }) {
    const path = usePathname();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (path.includes(link.link) || link.subLinks?.find(l => l.link.includes(path))) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [path])

    return (
        <div className={link.subLinks && link.subLinks?.length > 0 ? "bg-slate-100" : 'bg-white'}>
            <Link href={link.link} className={`py-2 px-4 ${path == link.link || link.subLinks?.find(l => l.link == path) ? 'bg-cyan-100/60 border-2 border-blue-500/40' : 'bg-white'} flex gap-4 items-center`}>
                {link.icon}
                <p className={`text-black text-lg font-medium hidden lg:block ${dmSans.className}`}>{link.text}</p>
            </Link>
            {
                open && link.subLinks && link.subLinks.map(sublink => (
                    <Link href={sublink.link} className={`py-2 px-4 flex gap-4 items-center ${path != sublink.link ? 'text-slate-800' : 'text-blue-600'}`}>
                        {sublink.icon}
                        <p className={`text-md font-medium ${dmSans.className} hidden lg:block`}>{sublink.text}</p>
                    </Link>
                ))
            }
        </div>
    )
}
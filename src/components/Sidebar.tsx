import { BriefcaseBusiness, CogIcon, Contact, HandCoins, Home, Landmark, ScrollText, ShoppingBag, ShoppingBasket, Store, UserCog, UserPlus, Users, Wallet } from "lucide-react";
import Logo from "./Logo";
import NavLink from "./NavLink";

export const adminLinks = [
    { link: '/dashboard', text: 'Dashboard', icon: <Home size={20} color="#1E96FC" /> },
    { link: '/jobs', text: 'Jobs', icon: <BriefcaseBusiness size={20} color="#1E96FC" /> },
    {
        link: '/products', text: 'Products', icon: <ShoppingBag size={20} color="#1E96FC" />, subLinks: [
            { link: '/products/inventory', text: 'Inventory', icon: <ShoppingBasket size={20} color="#1E96FC" /> },
            { link: '/products/suppliers', text: 'Suppliers', icon: <Store size={20} color="#1E96FC" /> },
        ]
    },
    { link: '/contractors', text: 'Contractors', icon: <Users size={20} color="#1E96FC" /> },
    { link: '/clients', text: 'Clients', icon: <Contact size={20} color="#1E96FC" /> },
    {
        link: '/payments', text: 'Payments', icon: <Wallet size={20} color="#1E96FC" />, subLinks: [
            { link: '/payments/invoices', text: 'Invoices', icon: <ScrollText size={20} color="#1E96FC" /> },
            { link: '/payments/expenses', text: 'Expenses', icon: <HandCoins size={20} color="#1E96FC" /> }
        ]
    },
    {
        link: '/settings', text: 'Settings', icon: <CogIcon size={20} color="#1E96FC" />, subLinks: [
            { link: '/settings/invites', text: 'Invite Team Member', icon: <UserPlus size={20} color="#1E96FC" /> },
            { link: '/settings/users', text: 'User Management', icon: <UserCog size={20} color="#1E96FC" /> },
            { link: '/settings/profile', text: 'Workspace Configuration', icon: <Landmark size={20} color="#1E96FC" /> },
        ]
    }
];

export default function Sidebar() {
    return (
        <div className="h-screen overflow-y-auto flex flex-col items-center lg:items-start gap-4 p-6 border-r-2 border-slate-50 md:max-w-[150px] lg:max-w-[250px]">
            <Logo />
            <div className="divide-2 divide-slate-200 grow ">
                {
                    adminLinks.map(link => (<NavLink link={link} key={link.link} />))
                }
            </div>
        </div>
    )
}
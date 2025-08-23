import { dmSans } from "../assets/fonts"

export default function Header({ title, description, action }: {
    title: string,
    description: string,
    action?: React.ReactNode
}) {
    return (
        (
            <div className="w-full flex justify-between items-center">
                <div className="flex flex-col gap-2">
                    <h1 className={`${dmSans.className} text-xl font-bold text-black`} >{title}</h1>
                    <p>{description}</p>
                </div>
                {action}
            </div>
        )
    )
}
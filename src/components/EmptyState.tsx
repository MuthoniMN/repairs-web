import React from "react";

export default function EmptyState({ title, description, icon, actions }: {
    title: string,
    description: string,
    icon?: React.ReactNode,
    actions?: React.ReactNode
}) {
    return (
        <div className="flex flex-col gap-4 justify-center items-center w-full h-full">
            {icon}
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="max-w-2xl">{description}</p>
            {actions}
        </div>
    )
}
import { AlertCircle } from "lucide-react";

export default function FormError({ err }: { err: string }) {
    return (
        <div className="py-2 px-4 bg-red-50 text-red-500 flex items-center gap-2">
            <AlertCircle size={18} />
            <p>{err}</p>
        </div>
    )
}
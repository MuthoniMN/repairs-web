import { dmSans } from "@/src/assets/fonts";

export default function Home({ children }: { children: React.ReactNode }) {
    return (
        <div className={`flex items-center justify-center h-screen p-8 gap-16 bg-white ${dmSans.className} overflow-y-scroll`}>
            {children}
        </div>
    );
}

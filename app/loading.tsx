import { HashLoader } from "react-spinners";

export default function Loading() {
    return (
        <section className="h-full w-full max-h-screen max-w-screen flex flex-col items-center justify-center bg-white">
            <HashLoader
                color="#1E96FC"
                size={80}
            />
        </section>
    )
}
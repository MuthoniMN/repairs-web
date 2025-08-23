import { DM_Sans, PT_Serif } from "next/font/google";

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
});

const sourceSerif = PT_Serif({
    variable: "--font-source-serif",
    weight: '700',
    subsets: ["latin"],
});

export { dmSans, sourceSerif };
import { Pixelify_Sans } from "next/font/google";

export const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "700"], // os pesos que você precisa
    variable: "--font-sans",       // amarra na variável CSS
});

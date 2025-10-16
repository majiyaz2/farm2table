import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"]
})

export const Footer = () => {
    return (
        <nav className="h-20 border-t font-medium bg-white">
            <div className="max-w-(--breakpoint-xl) mx-auto flex items-center h-full gap-2 px-4 py-6 lg:px-10">
                <p>Powered by</p>
                <Link href="/">
                    <span className={cn("text-2xl font-semibold", poppins.className)}>
                        Farm2Table
                    </span>
                </Link>
            </div>
        </nav>
    );
};
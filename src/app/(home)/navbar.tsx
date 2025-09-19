import Link from "next/link";
import { Poppins } from "next/font/google";

import {cn} from "@/lib/utils";
import { Button } from "@/components/ui/button";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"],
});


export const Navbar = () => {
    return (
        <nav className="h-20 flex border-b justify-between font-medium bg-white">
            <Link href={"/"} className="pl-6 flex items-center">
                <span className={cn("text-5xl font-semibold", poppins.className)}>
                    Farm2Table
                </span>
            </Link>
        </nav>
    );
};
import { getPayload } from "payload";
import configPromise from "@payload-config";

import { Footer } from "@/modules/home/ui/components/footer";
import { SearchFilters, SearchFilterSkeleton } from "@/modules/home/ui/components/search-filters";
import { trpc } from "@/trpc/server";
import { getQueryClient } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { Navbar } from "@/modules/checkout/ui/components/navbar";

interface Props {
    children: React.ReactNode;
    params: Promise<{slug: string}>
}

const Layout = async ({ children, params }: Props) => {
    const {slug} = await params;
    return (
        <div className="flex flex-col min-h-screen bg-[#F4F4F0]">
           <Navbar slug={slug}/>
           <div className="flex-1 ">
            <div className="max-w-(--breakpoint-xl) mx-auto">
                {children}
            </div>
           </div>
           <Footer />
        </div>
    );
};

export default Layout;
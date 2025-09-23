import { getPayload } from "payload";
import configPromise from "@payload-config";

import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { SearchFilters, SearchFilterSkeleton } from "./search-filters";
import { trpc } from "@/trpc/server";
import { getQueryClient } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
    children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.categories.getMany.queryOptions(),
    );
    return (
        <div className="flex flex-col min-h-screen">
           <Navbar />
           <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<SearchFilterSkeleton/>}>
                    <SearchFilters/>
                </Suspense>
           </HydrationBoundary>
           <div className="flex-1 bg-[#F4F4F0]">
                {children}
           </div>
           <Footer />
        </div>
    );
};

export default Layout;
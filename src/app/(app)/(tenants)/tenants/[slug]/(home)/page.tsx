import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";
import { loadProductFilters } from "@/modules/products/searchParams";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { DEFAULT_PAGE_LIMIT } from "@/constants";

interface Props {
    searchParams: Promise<SearchParams>
    params: Promise<{slug: string}>
}

const Page = async ({searchParams, params}: Props) => {
    const filters  =  loadProductFilters(searchParams);
    const queryClient = getQueryClient();
    const {slug} = await params;

    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
   
        ...filters,
        tenantSlug: slug,
        limit: DEFAULT_PAGE_LIMIT,
    }))
    

    
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductListView  tenantSlug={slug} narrowView/>
        </HydrationBoundary>
    );
};

export default Page;

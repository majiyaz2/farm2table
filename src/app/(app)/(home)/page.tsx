import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";
import { loadProductFilters } from "@/modules/products/searchParams";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { DEFAULT_PAGE_LIMIT } from "@/constants";

interface Props {
    searchParams: Promise<SearchParams>
}

const CategoryPage = async ({searchParams}: Props) => {
    const filters  =  loadProductFilters(searchParams);
    const queryClient = getQueryClient();

    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
   
        ...filters,
        limit: DEFAULT_PAGE_LIMIT,
    }))
    

    
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductListView />
        </HydrationBoundary>
    );
};

export default CategoryPage;

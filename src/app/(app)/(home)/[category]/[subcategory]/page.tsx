import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { loadProductFilters } from "@/modules/products/searchParams";
import { DEFAULT_PAGE_LIMIT } from "@/constants";
import type { SearchParams } from "nuqs/server";

interface Props {
    params: Promise<{
        subcategory: string
    }>;
    searchParams: Promise<SearchParams>
}

const CategoryPage = async ({params, searchParams}: Props) => {
    const {subcategory} = await params;
    const filters  =  loadProductFilters(searchParams);
    const queryClient = getQueryClient();
    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
        category: subcategory,
        ...filters,
        limit: DEFAULT_PAGE_LIMIT,
    }))
    

    
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductListView category={subcategory}/>
        </HydrationBoundary>
    );
};

export default CategoryPage;

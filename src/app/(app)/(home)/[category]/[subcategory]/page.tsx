import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";

interface Props {
    params: Promise<{
        subcategory: string
    }>;
}

const CategoryPage = async ({params}: Props) => {
    const queryClient = getQueryClient();
    const {subcategory} = await params;
    void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({
        category: subcategory,
    }))
    

    
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductListView category={subcategory}/>
        </HydrationBoundary>
    );
};

export default CategoryPage;

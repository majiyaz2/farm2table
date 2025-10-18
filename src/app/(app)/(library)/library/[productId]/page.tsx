import { DEFAULT_PAGE_LIMIT } from "@/constants";
import { LibraryView } from "@/modules/library/ui/views/library-view"
import { ProductView } from "@/modules/library/ui/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface PageProps {
    params: Promise<{productId: string}>
}

const Page = async ({params}: PageProps) => {
    const {productId} = await params;
    const queryClient = getQueryClient();

    void queryClient.prefetchQuery(trpc.library.getOne.queryOptions({
        productId,
    }))
    
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductView productId={productId}/>
        </HydrationBoundary>
    )
}

export default Page

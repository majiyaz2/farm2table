
"use client"
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../../hooks/use-cart";
import { useTRPC } from "@/trpc/client";
import { useEffect } from "react";
import { toast } from "sonner";
interface CheckoutViewProps {
    tenantSlug: string;
}

export const CheckoutView = ({tenantSlug} : CheckoutViewProps) => {
    const {productIds, clearAllCarts} = useCart(tenantSlug);
    
    const trpc = useTRPC()
    const {data, isLoading, error} = useQuery(trpc.checkout.getProducts.queryOptions({
        ids: productIds
    }))

    useEffect(() => {
        if(error?.data?.code === "NOT_FOUND"){
            clearAllCarts()
            toast("Products not found")
        }
    }, [error])
   
    return (
        <div>
            {JSON.stringify(data, null, 2)}
        </div>
    )
}
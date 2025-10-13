
"use client"
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../../hooks/use-cart";
import { useTRPC } from "@/trpc/client";
import { useEffect } from "react";
import { toast } from "sonner";
import { CheckoutItem } from "../components/checkout-item";
import { generateTenantURL } from "@/lib/utils";
interface CheckoutViewProps {
    tenantSlug: string;
}

export const CheckoutView = ({tenantSlug} : CheckoutViewProps) => {
    const {productIds, clearAllCarts, removeProduct} = useCart(tenantSlug);
    
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
        <div className="lg:pt-16 pt-4 px-4 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap4 lg:gap-16">
                <div className="lg:col-span-4"> 
                    <div className="border rounded-md overflow-hidden bg-white">
                        {data?.docs.map((product) => (
                            <div key={product.id}>
                                <CheckoutItem
                                    imageUrl={product.image?.url}
                                    name={product.name}
                                    productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`}
                                    tenantUrl={generateTenantURL(product.tenant.slug)}
                                    tenantName={product.tenant.name}
                                    price={product.price}
                                    onRemove={() => removeProduct(product.id)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-3">
                    Checkout sidebar
                </div>
            </div>
        </div>
    )
}

"use client"
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCart } from "../../hooks/use-cart";
import { useTRPC } from "@/trpc/client";
import { useEffect } from "react";
import { toast } from "sonner";
import { CheckoutItem } from "../components/checkout-item";
import { generateTenantURL } from "@/lib/utils";
import { CheckoutSidebar } from "../components/checkout-sidebar";
import { InboxIcon, LoaderIcon } from "lucide-react";
import { useCheckoutStates } from "../../hooks/use-checkout-states";
import { useRouter } from "next/navigation";
interface CheckoutViewProps {
    tenantSlug: string;
}

export const CheckoutView = ({tenantSlug} : CheckoutViewProps) => {
    const router = useRouter()
    const [states, setStates] = useCheckoutStates()
    const {productIds, clearAllCarts, removeProduct, clearCart} = useCart(tenantSlug);
    
    const trpc = useTRPC()
    const {data, isLoading, error} = useQuery(trpc.checkout.getProducts.queryOptions({
        ids: productIds
    }))

    const purchase  = useMutation(trpc.checkout.purchase.mutationOptions(
        {
            onMutate: () => {
                setStates({
                    cancel: false,
                    success: false,
                })
            },
            onSuccess: (data) => {
               window.location.href = data?.url || ""
            },
            onError: (error) => {
                if(error?.data?.code === "NOT_FOUND"){
                    toast("Products not found")
                }
                if(error?.data?.code === "INTERNAL_SERVER_ERROR"){
                    toast.error(error.message)
                }
                if(error?.data?.code === "UNAUTHORIZED"){
                    router.push("/sign-in")
                    toast("Unauthorized")
                }

                
            }
        }
    ))

    useEffect(() => {
        if(states.success){
            setStates({
                success: false,
                cancel: false,
            })
            clearCart()
            router.push(`/products`)
        }
    }, [states.success, clearCart, router])

    useEffect(() => {
        if(error?.data?.code === "NOT_FOUND"){
            clearCart()
            toast("Products not found")
        }
    }, [error, clearCart])


    if(isLoading){
        return (
            <div className="lg:pt-16 pt-4 px-4 lg:px-12">
                <div className=" flex border border=black border-dashed flex-items items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
                    <LoaderIcon className="animate-spin text-muted-foreground"/>
                </div>
            </div>
        );
    }

    if(!data || data.docs.length === 0){
        return (
            <div className="lg:pt-16 pt-4 px-4 lg:px-12">
                <div className=" flex border border=black border-dashed flex-items items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
                    <InboxIcon/>
                    <p className=" text-base font-medium">No products found</p>
                </div>
            </div>
        );
    }
   
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
                    <CheckoutSidebar
                        total={data?.totalPrice || 0}
                        onPurchase={() => purchase.mutate({
                            productIds,
                            tenantSlug
                        })}
                        disabled={purchase.isPending}
                        isCanceled={states.cancel}
                    />
                </div>
            </div>
        </div>
    )
}
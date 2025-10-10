"use client"
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { formatCurrency, generateTenantURL } from "@/lib/utils";
import Link from "next/link";
interface ProductViewProps {
    productId: string;
    tenantSlug: string;
}
    
const ProductView = ({productId, tenantSlug}: ProductViewProps) => {
    const trpc = useTRPC()
    const {data } = useSuspenseQuery(trpc.products.getOne.queryOptions({
        id: productId,
    }))
    
    return (
        <div className="px-4 lg:px-12 py-10">
            <div className="border rounded-sm bg-white overflow-hidden">
                <div className="relative aspect-[3.9] border-b">
                    <Image
                        src={data?.image?.url || "/placeholder.png"}
                        alt={data?.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-6">
                    <div className="col-span-4">
                        <div className="p-6">
                            <h1 className="text-4xl font-medium">{data?.name}</h1>
                        </div>
                        <div className="border-y flex">
                            <div className="px-6 py-4 flex items-center justify-center border-r">
                                <div className="relative px-2 py-1 border bg-pink-400 w-fit">
                                    <p className="text-base font-medium">{formatCurrency(data?.price)}</p>
                                </div>
                            </div>

                            <div className="px-6 py-4 flex items-center justify-center lg:border-r">
                                <Link href={generateTenantURL(data?.tenant.slug)} className="flex items-center gap-2">
                                    {data?.tenant.image && (
                                        <Image
                                            src={data?.tenant.image?.url || "/placeholder.png"}
                                            alt={data?.tenant.slug}
                                            width={24}
                                            height={24}
                                            className="rounded-full border shrink-0 size-[16px]"
                                        />
                                    )}
                                    <p className="text-base underline font-medium">
                                        {data?.tenant.slug}
                                    </p>
                                </Link>
                            </div>
                            <div>
                                
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default ProductView

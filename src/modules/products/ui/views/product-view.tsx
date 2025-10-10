"use client"
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { formatCurrency, generateTenantURL } from "@/lib/utils";
import Link from "next/link";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { LinkIcon, StarIcon } from "lucide-react";
import { Fragment } from "react";
import { Progress } from "@/components/ui/progress";
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
                            <div className="hidden lg:flex px-6 py-4 items-center justify-center">
                                <div className="flex items-center gap-1">
                                    <StarRating 
                                        rating={2}
                                        iconClassName="size-4"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="block lg:hidden px-6 py-4 items-center justify-center border-b">
                            <div className="flex items-center gap-1">
                                <StarRating 
                                    rating={2}
                                    iconClassName="size-4"
                                />
                                <p className="text-base font-medium">
                                    {5} ratings
                                </p>
                            </div>
                        </div>

                        <div className="px-6 py-4">
                            {data?.description ? (
                                <p className="text-base font-medium ">
                                    {data?.description}
                                </p>
                            ) : (
                                <p className="text-base font-medium text-muted-foreground italic">
                                    No description available
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className="border-t lg:border-t-0 lg:border-l h-full">
                            <div className="flex flex-col gap-4 p-6 border-b">
                                <div className="flex flex-row items-center gap-2">
                                    <Button
                                        variant={"elevated"}
                                        className="flex-1 bg-pink-400"
                                    >
                                        Add to cart
                                    </Button>
                                    <Button
                                        variant={"elevated"}
                                        className="size-12"
                                        onClick={() => {}}
                                        disabled={false} 
                                    >
                                        <LinkIcon/>
                                    </Button>
                                </div>
                                <p className="text-center font-medium">
                                    {data.refundPolicy === "no-refund"
                                    ? "No refunds":
                                    `${data.refundPolicy} freshness guarantee`
                                    }
                                </p>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                   <h3 className="text-xl font-medium">Ratings</h3>
                                   <div  className="flex items-center gap-x-1 font-medium">
                                        <StarIcon className="size-4 fill-black"/>
                                        <p>({5})</p>
                                        <p className="text-base">ratings</p>
                                   </div>
                                </div>
                                <div
                                    className="grid grid-cols-[auto_1fr_auto] gap-3 mt-4"
                                >
                                    {[5,4,3,2,1].map((stars) => (
                                        <Fragment key={stars}>
                                            <div className="font-medium">{stars} {stars === 1 ? "star" : "stars"}</div>
                                            <Progress
                                                value={25}
                                                className="h-[1lh]"
                                            />
                                            <div className="font-medium">
                                                {25}%
                                            </div>
                                        </Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  
            </div>
        </div>
    )
}

export default ProductView

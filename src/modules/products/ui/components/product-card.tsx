"use client"
import { generateTenantURL } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface ProductCardProps {
    id: string;
    name: string;
    imageUrl?: string | null;
    tenantSlug: string;
    tenantImageUrl?: string | null;
    reviewRating: number;
    reviewCount: number;
    price: number;
}


export const ProductCard = ({
    id,
    name,
    imageUrl,
    tenantSlug,
    tenantImageUrl,
    reviewRating,
    reviewCount,
    price,
}: ProductCardProps) => {  
    const router = useRouter()
    
    const handleUserClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(generateTenantURL(tenantSlug))

    }
    return (
        <Link href={`${generateTenantURL(tenantSlug)}/products/${id}`}>
            <div className="hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow border rounded-md bg-white overflow-hidden h-full flex flex-col">
                <div className="relative aspect-square">
                    <Image
                        alt={name}
                        fill
                        src={imageUrl || "/placeholder.png"}
                        className="object-cover"
                    />
                </div>
                <div className="p-4 border-y flex flex-col gap-3 flex-1">
                    <h2 className="text-lg font-medium line-clamp-4">
                        {name}
                    </h2>
                    <div className="flex items-center gap-2" onClick={handleUserClick}>
                        {tenantImageUrl && (
                            <Image
                                alt={tenantSlug}
                                width={24}
                                height={24}
                                src={tenantImageUrl}
                                className="rounded-full border shrink-0 size-[16px]"
                            />
                        )}
                        <p className="text-sm underline font-medium">{tenantSlug}</p>
                    </div>
                    {reviewCount > 0 && (
                        <div className="flex items-center gap-1">
                            <StarIcon className="size-3.5 fill-black"/>
                            <p className="text-sm font-medium">{reviewRating}</p>
                            <p className="text-sm font-medium">({reviewCount})</p>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <div className="relative px-2 py-1 border bg-pink-400 w-fit">
                        <p className="text-sm font-medium">
                            {new Intl.NumberFormat("en-ZA", {
                                style: "currency",
                                currency: "ZAR",
                                maximumFractionDigits: 0
                            }).format(price)}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export const ProductCardSkeleton = () => {
    return (
        <div className="w-full aspect-3/4 bg-neutral-200 rounded animate-pulse"/>
    )
};

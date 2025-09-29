"use client"

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface Props {
    category: string;
}

export const ProductList = ({category}: Props) => {
    const trpc = useTRPC()
    const {data} = useSuspenseQuery(trpc.products.getMany.queryOptions({category}));
    return (
        <div>
            <h2>Product List</h2>
            <ul>
                {data.docs.map((product) => (
                    <li key={product.id}>{product.name}</li>
                ))}
            </ul>
        </div>
    );
};


export const ProductListSkeleton = () => {
    return (
        <div>
            <h2>Product List</h2>
            <ul>
                <li>Loading...</li>
            </ul>
        </div>
    );
}
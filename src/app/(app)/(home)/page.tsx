"use client"
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
export default function Home() {

 
  const trpcClient = useTRPC();
  const categories = useQuery(trpcClient.categories.getMany.queryOptions())
  return (


   <div>
    {categories.isLoading && <p>Loading...</p>}
    {categories.error && <p>Error: {categories.error.message}</p>}
     {JSON.stringify(categories.data, null, 2)}
   </div>
  );
}
 
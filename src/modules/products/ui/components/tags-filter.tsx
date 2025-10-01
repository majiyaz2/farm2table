import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_PAGE_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";

interface TagsFilterProps {
    tags: string[] | null;
    onTagsChange: (tags: string[]) => void;
}

export const TagsFilter = ({tags, onTagsChange}: TagsFilterProps) => {
    const trpc = useTRPC();
    const { data, 
            isLoading, 
            fetchNextPage, 
            hasNextPage,
            isFetchingNextPage } = useInfiniteQuery(trpc.tags.getMany.infiniteQueryOptions(
        {
            limit: DEFAULT_PAGE_LIMIT,
        },
        {
            getNextPageParam: (lastPage) => {
                return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
            },
        }
    ))
    
    const onClick = (tag: string) => {
        if(tags?.includes(tag)) {
            onTagsChange(tags.filter((t) => t !== tag));
        } else {
            onTagsChange([...(tags || []), tag]);
        }
    }

    return(
        <div className="flex flex-col gap-y-2">
            {isLoading ? (
                <div className="flex flex-col gap-y-2">
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                </div>
            ) : (
                data?.pages.map((page) => (
                    page.docs.map((tag) => (
                      <div 
                        key={tag.id}
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => onClick(tag.name)}
                    >
                        <p className="font-medium">{tag.name}</p>
                        <Checkbox
                            checked={tags?.includes(tag.name)}
                            onCheckedChange={() => onClick(tag.name)}
                        />
                      </div>
                    ))
                ))
            )}
            {hasNextPage && (
                <button
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                    className="underline font-medium justify-start text-start disabled:opacity-50 cursor-pointer"
                >
                    Load more...
                </button>
            )}
        </div>
    );
}
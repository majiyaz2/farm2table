import { cn, formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
interface CheckoutItemProps {
    isLast?: boolean;
    imageUrl?: string | null;
    name: string;
    productUrl: string;
    tenantUrl: string;
    tenantName: string;
    price: number;
    onRemove: () => void;
}

export const CheckoutItem = ({
    isLast,
    imageUrl,
    name,
    productUrl,
    tenantUrl,
    tenantName,
    price,
    onRemove
}: CheckoutItemProps) => {
    return (
        <div
            className={cn(
                "grid grid-cols-[8.5rem_1fr_auto] gap-4 pr-4 border-b",
                isLast && "border-b-0"
            )}
        >
            <div className="overflow-hidden border-r">
                <div className="relative aspect-square h-full">
                    <Image
                        src={imageUrl || "/placeholder.png"}
                        fill
                        className="object-cover"
                        alt={name}
                    />
                </div>
            </div>

            <div className="py-4 flex flex-col justify-between">
                <div>
                    <Link href={productUrl}>
                        <p className="font-bold hover:underline">{name}</p>
                    </Link>
                    <Link href={tenantUrl}>
                        <p className="font-medium hover:underline">{tenantName}</p>
                    </Link>
                </div>
            </div>

            <div className="py-4 flex flex-col justify-between">
                <p className="font-medium">
                    {formatCurrency(price)}
                </p>
                <button onClick={onRemove} type="button" className="font-medium text-red-500 hover:underline cursor-pointer">
                    Remove
                </button>
            </div>
        </div>
    );
};
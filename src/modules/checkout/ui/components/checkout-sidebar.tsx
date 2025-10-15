import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { CircleXIcon } from "lucide-react";

interface CheckoutSidebarProps {
    total: number;
    onPurchase: () => void;
    disabled?: boolean;
    isCanceled?: boolean;
}

export const CheckoutSidebar = ({
    total,
    onPurchase,
    disabled,
    isCanceled
}: CheckoutSidebarProps) => {
    return (
        <div className="border rounded-md overflow-hidden bg-white flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
                <h4 className="font-medium text-lg">Total</h4>
                <p className="font-medium text-lg">{formatCurrency(total)}</p>
            </div>
            <div className="p-4 flex items-center justify-center">
                <Button
                    variant={"elevated"}
                    onClick={onPurchase}
                    disabled={disabled}
                    size={"lg"} 
                    className="w-full text-base text-white bg-primary hover:bg-pink-400 hover:text-primary"
                >
                    Checkout
                </Button>
            </div>
            {isCanceled && (
                <div className="p-4 flex items-center justify-center border-t">
                    <div className="bg-red-100 border-red-400 font-medium px-4 py-3 flex items-center rounded w-full">
                        <div className="flex items-center gap-x-2">
                            <CircleXIcon className="size-6 mr-2 text-red-100 fill-red-500"/>
                            <span>Checkout failed. Please try again</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@/hooks/patient/useCategory";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";

type SubcategoryCarouselProps = {
    subcategories: Category[];
    loading?: boolean;
    onSelect?: (slug: string) => void;
    selectedSlug?: string | null;
};

export function SubcategoryCarousel({
    subcategories,
    loading,
    onSelect,
    selectedSlug,
}: SubcategoryCarouselProps) {
    const [selected, setSelected] = useState<number | null>(0);

    if (loading) {
        return (
            <div className="w-full overflow-x-auto">
                <Carousel opts={{ align: "start" }}>
                    <CarouselContent>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <CarouselItem key={i} className="basis-auto">
                                <div className="flex justify-center items-center px-2 py-2">
                                    <Skeleton className="h-12 w-28 rounded-lg bg-grey1/40" />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        );
    }

    if (subcategories.length === 0) {
        return (
            <div className="text-sm py-4 text-center text-white opacity-70">
                No subcategories found.
            </div>
        );
    }

    return (
        <Carousel opts={{ align: "start" }} className="w-full overflow-x-auto">
            <CarouselContent>
                {subcategories.map((item, index) => (
                    <CarouselItem key={item._id || index} className="basis-auto">
                        <div
                            onClick={() => {
                                setSelected(index);
                                onSelect?.(item.slug);
                            }}
                            className={`rounded-xl h-14 cursor-pointer flex flex-col items-center ${selectedSlug === item.slug
                                ? "border-4 border-sec bg-sec/10"
                                : "opacity-60 hover:opacity-90"
                                }`}
                        >
                            <div
                                className={`sm:text-xl text-lg font-normal h-14 text-grey1 flex px-3 rounded-lg items-center w-fit ${selectedSlug === item.slug
                                    ? "border-none text-white"
                                    : "border-2 border-sec"
                                    }`}
                            >
                                {item.name}
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}

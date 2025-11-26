"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Category } from "@/hooks/patient/useCategory";
import Image from "next/image";
import { useState } from "react";

type CategoryCarouselProps = {
    categories: Category[];
    selectedSlug?: string | null;
    onSelect?: (slug: string) => void;
    isLoading?: boolean;
};

export const CategoryCarousel = ({ categories, selectedSlug, onSelect, isLoading }: CategoryCarouselProps) => {
    return (
        <div className="overflow-x-auto max-w-full xl:max-w-[970px] 2xl:max-w-[1120px] 3xl:max-w-full w-full">
            <Carousel opts={{ align: "start" }}>
                <CarouselContent>
                    {categories.map((item, index) => (
                        <CarouselItem
                            key={index}
                            className="xxxs:basis-[60%] xs:basis-[60%] ssm:basis-[40%] sm:basis-1/3 md:basis-1/3 lg:basis-1/5 3xl:basis-1/6 w-full"
                        >
                            <div
                                onClick={() => onSelect?.(item.slug)}
                                className={`rounded-xl py-4 cursor-pointer flex flex-col items-center ${selectedSlug === item.slug
                                    ? "border-4 border-sec bg-sec/10"
                                    : "opacity-60 hover:opacity-90"
                                    }`}
                            >
                                <div className="flex justify-center items-center w-full h-auto">
                                    <Card className="p-0 rounded-full flex justify-center items-center bg-transparent">
                                        <CardContent className="flex aspect-square items-center justify-center p-0 relative h-36 w-36">
                                            <Image
                                                src={item.thumbnailUrl}
                                                alt={item.name}
                                                fill
                                                className="rounded-full object-cover"
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                                <p
                                    className={`text-center mt-4 text-responsive text-white truncate max-w-[120px] sm:max-w-[140px] md:max-w-[160px]`}
                                    title={item.name}
                                >
                                    {item.name}
                                </p>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className="hidden" />
                <CarouselNext className="hidden" />
            </Carousel>
        </div>
    );
};

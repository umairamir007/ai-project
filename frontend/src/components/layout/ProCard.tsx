"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";

type ProCardProps = {
    title?: string;
    imageSrc?: string;
    images?: string[];
    points?: number | string;
    price?: number | string;
};

const ProCard: React.FC<ProCardProps> = ({
    title = "CaC-1000 Plus",
    imageSrc = "/images/orange.png",
    images,
    points = 300,
    price = 300,
}) => {
    const gallery = (images?.length ? images : [imageSrc]).slice(0, 10);

    return (
        <Card className="w-full rounded-3xl ring-1 ring-zinc-800 mb-6">
            <CardContent className="p-0">
                {/* IMAGE AREA */}
                <div className="p-6 pt-0">
                    <div className="relative w-full h-[210px] rounded-2xl bg-[#EFEFEF] overflow-hidden grid place-items-center">
                        <Carousel
                            className="h-full w-full"
                            opts={{ loop: gallery.length > 1, dragFree: false, align: "start" }}
                        >
                            <CarouselContent className="h-full">
                                {gallery.map((src, idx) => (
                                    <CarouselItem
                                        key={`${src}_${idx}`}
                                        className="h-[210px] grid place-items-center"
                                        aria-label={`${title} image ${idx + 1} of ${gallery.length}`}
                                    >
                                        <Image
                                            src={src}
                                            alt={`${title} ${idx + 1}`}
                                            width={240}
                                            height={240}
                                            className="h-[170px] w-auto object-contain"
                                            priority={idx === 0}
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            {gallery.length > 1 && (
                                <>
                                    <CarouselPrevious
                                        aria-label="Previous image"
                                        variant="ghost"
                                        size="icon"
                                        className="
                      absolute left-2 top-1/2 -translate-y-1/2 z-10
                      h-9 w-9 rounded-full
                      bg-[#EFEFEF] hover:bg-[#E7E7E7]
                      text-zinc-600 hover:text-zinc-800
                      shadow-none border-0
                      transition-colors
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300
                    "
                                    />
                                    <CarouselNext
                                        aria-label="Next image"
                                        variant="ghost"
                                        size="icon"
                                        className="
                      absolute right-2 top-1/2 -translate-y-1/2 z-10
                      h-9 w-9 rounded-full
                      bg-[#EFEFEF] hover:bg[#E7E7E7]
                      text-zinc-600 hover:text-zinc-800
                      shadow-none border-0
                      transition-colors
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300
                    "
                                    />
                                </>
                            )}
                        </Carousel>
                    </div>
                </div>

                {/* TEXT AREA */}
                <div className="px-8 pb-4  text-left">
                    <h3 className="text-lg font-light tracking-tight text-black">{title}</h3>

                    <div className="mt-3 flex items-center gap-2">
                        <Image
                            src="/images/comission.png"
                            alt="points"
                            width={22}
                            height={22}
                            className="object-contain"
                        />
                        <span className="text-lg font-medium leading-none text-black">{points}</span>
                    </div>

                    <div className="mt-3">
                        <span className="text-lg leading-none text-[#A2A2A2]">${price}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProCard;

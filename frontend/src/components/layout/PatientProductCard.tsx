"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart.store";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

type PatientProductCardProps = {
    product: {
        _id: string;
        name: string;
        image: string;
        pricePerUnit: number;
        subcategorySlug?: string;
    };
    className?: string;
};

const PatientProductCard: React.FC<PatientProductCardProps> = ({ product, className = "" }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const addItem = useCartStore((s) => s.addItem);

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        addItem({
            id: product._id,
            title: product.name,
            price: product.pricePerUnit,
            image: product.image,
        });
    };

    return (
        <Card className={`p-0 w-full cursor-pointer ${className}`}>
            <CardContent className="3xl:px-6 3xl:py-6 px-4 py-4 flex flex-col h-full">
                <Link href={`/dashboard/marketplace/product-details/${product._id}`} className="flex flex-col flex-grow">
                    <div className="w-full h-46 relative mb-4">
                        {!imageLoaded && (
                            <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />
                        )}

                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className={`object-contain rounded-xl transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"
                                }`}
                            onLoadingComplete={() => setImageLoaded(true)}
                        />
                    </div>

                    {/* Fixed height section for text */}
                    <div className="flex flex-col justify-between flex-grow">
                        <div className="min-h-[40px] flex items-start">
                            <p className="text-responsive font-semibold line-clamp-2">{product.name}</p>
                        </div>

                        <div className="space-y-2 mt-2">
                            <Badge variant="transparent" className="truncate sm:px-3 px-4 sm:py-2 py-2 sm:text-sm text-xs ">{product.subcategorySlug}</Badge>
                            <p className="text-responsive">{`$${product.pricePerUnit}`}</p>
                        </div>
                    </div>
                </Link>

                <Button className="w-full mt-4 py-3" onClick={handleAdd} type="button">
                    Add to Cart
                </Button>
            </CardContent>
        </Card>
    );
};

export default PatientProductCard;

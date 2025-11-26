'use client';

import Image from "next/image";
import Link from "next/link";
import { Heading } from "./heading";

type PackageCardProps = {
    ctn: string;
    imgSrc?: string;
    href?: string;          // optional link target
    onClick?: () => void;   // fallback click handler
};

export const PackageCard = ({ ctn, imgSrc, href, onClick }: PackageCardProps) => {
    const normalizedSrc = imgSrc
        ? encodeURI(imgSrc.startsWith("/") ? imgSrc : `/${imgSrc}`)
        : null;

    const content = (
        <>
            <Heading className="text-xl sm:text-base" title={ctn} />
            {normalizedSrc && (
                <div
                    aria-hidden
                    className="absolute -mb-1 -mr-1 right-2 bottom-2 pointer-events-none select-none"
                >
                    <Image
                        src={normalizedSrc}
                        alt=""
                        width={160}
                        height={160}
                        priority
                    />
                </div>
            )}
        </>
    );

    // If href is passed → wrap in Next <Link>
    if (href) {
        return (
            <Link
                href={href}
                className="relative w-full overflow-hidden rounded-2xl text-white
        bg-alpha p-5 sm:p-6 min-h-[230px] sm:min-h-[240px] h-full
        cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40"
            >
                {content}
            </Link>
        );
    }

    // Otherwise → use div with onClick
    return (
        <div
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : -1}
            onClick={onClick}
            onKeyDown={(e) =>
                onClick && (e.key === "Enter" || e.key === " ") && onClick()
            }
            className={`relative w-full overflow-hidden rounded-2xl text-white
        bg-alpha p-5 sm:p-6 min-h-[230px] sm:min-h-[240px] h-full
        ${onClick ? "cursor-pointer" : ""} focus:outline-none focus:ring-2 focus:ring-white/40`}
        >
            {content}
        </div>
    );
};

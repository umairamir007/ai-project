"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type DropCardProps = {
    heading?: React.ReactNode;
    btnContent?: React.ReactNode;
    ModalComponent?: React.ComponentType<{ open: boolean; onClose: () => void }>;
    className?: string;
    buttonClassName?: string;
    link?: string;
};

export default function DropCard({
    heading = "Create a proposal to suggest changes for the DAO.",
    btnContent = "Create",
    ModalComponent,
    className,
    buttonClassName,
    link,
}: DropCardProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <Card
                className={cn(
                    "flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4",
                    "p-3 sm:p-4 md:p-5 rounded-2xl bg-white ring-black/5",
                    className
                )}
            >
                <p className="w-full sm:flex-1 text-center sm:text-left font-semibold text-base sm:text-lg md:text-xl leading-snug text-black">
                    {heading}
                </p>

                {link ? (

                    <Link
                        href={link}
                        className={cn(
                            "w-full sm:w-auto h-11 sm:h-12 px-5 sm:px-8 rounded-full shrink-0 flex items-center justify-center",
                            "bg-primary text-white font-medium",
                            buttonClassName
                        )}
                    >
                        {btnContent}
                    </Link>
                ) : (

                    <Button
                        onClick={() => setOpen(true)}
                        className={cn(
                            "w-full sm:w-auto h-11 sm:h-12 px-5 sm:px-8 rounded-full shrink-0",
                            "bg-primary",
                            buttonClassName
                        )}
                    >
                        {btnContent}
                    </Button>
                )}
            </Card>

            {ModalComponent && (
                <ModalComponent open={open} onClose={() => setOpen(false)} />
            )}
        </>
    );
}

import { cn } from "@/lib/utils";
import React, { JSX } from "react";

type PropTypes = {
    fluid?: boolean;
    shrink?: boolean;
    children: JSX.Element | JSX.Element[];
    className?: string;
};

const Container = ({ children, shrink = false, className }: PropTypes) => {
    return (
        <div
            className={cn(`mx-auto w-full py-8 3xl:py-10 px-4 sm:px-8 xl:px-8`, shrink ? "max-w-[70rem]" : "max-w-full", className)}
        >
            {children}
        </div>
    );
};

export default Container;

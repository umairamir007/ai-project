import * as React from "react"
import { cva } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "../lib/utils";

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full font-medium transition-colors text-base focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none gap-2 group disabled:opacity-40 disabled:cursor-not-allowed transition-all ease-in-out duration-300 whitespace-nowrap cursor-pointer',
  {
    variants: {
      variant: {
        default: "bg-primary text-white",
        destructive: "!bg-destructive text-white",
        outline: "border bg-transparent dark:border-primary",
        outline2: "bg-white text-primary border border-primary",
        pagination: "bg-transparent text-white hover:text-white",
        primaryOutline: "border border-primary text-primary bg-transparent",
        secondary: "bg-white text-secondary",
        secondary2: "bg-secondary text-white",
        muted: "bg-grey5 text-muted-black",
        ghost: "bg-transparent shadow-none border-none",
        ghost2: "bg-transparent shadow-none text-grey4 border-none hover:bg-grey2",
        ghost3: "bg-transparent shadow-none text-grey4 border-none",
        columns: "text-lg font-light text-tableHeading",
        ghostDestructive: "text-destructive",
        icon: "",
        roundButton: "border-3 border-grey5 bg-white",
        link: "text-grey1 underline-offset-4 underline",
        disabled: "opacity-80",
        outline1: "bg-transparent dark:border-primary",
        tableHeader:
          "sm:text-base text-sm 3xl:text-lg rounded-md font-semibold !px-0 text-iconGrey",
        grey: "bg-iconGrey text-white rounded-full hover:bg-iconGrey/90",
        alpha: "bg-white text-black py-2 w-full rounded-full text-xl font-bold",
      },
      size: {
        default: "p-3 px-6 py-4 has-[>svg]:px-4",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        md: "p-4 has-[>svg]:px-4",
        lg: "h-12 px-8 has-[>svg]:px-6",
        icon: "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? "span" : "button"
    const isDisabled = loading || disabled

    return (
      <Comp
        ref={ref}
        disabled={isDisabled}
        className={cn(
          buttonVariants({ variant, size }),
          className
        )}
        {...props}
      >
        {children}
        {loading && <Loader2 className="animate-spin" />}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }

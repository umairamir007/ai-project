import * as React from "react"

import { cva } from "class-variance-authority"


import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full font-medium transition-colors text-base focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none gap-2 group disabled:opacity-40 disabled:cursor-not-allowed transition-all ease-in-out duration-300 whitespace-nowrap cursor-pointer',
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white",
        destructive:
          "!bg-destructive text-white :bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-transparent dark:border-primary ",
        outline2:
          "bg-white text-primary border border-primary",
        pagination:
          "bg-transparent text-white hover:text-white",
        primaryOutline:
          "border border-primary text-primary bg-transparent :bg-accent/10 :text-accent",
        secondary:
          "bg-white hover:bg-white text-secondary",
        secondary2:
          "bg-secondary text-white",
        muted:
          "bg-grey5 text-muted-black :bg-grey5/80",
        ghost:
          "bg-transparent shadow-none border-none :bg-accent dark:bg-accent/50",
        ghost2:
          "bg-transparent shadow-none text-grey4 border-none hover:bg-grey2",
        ghost3:
          "bg-transparent shadow-none text-grey4 border-none",
        columns:
          "text-lg font-light text-tableHeading",
        ghostDestructive:
          ":bg-destructive text-destructive :text-white dark::bg-destructive/50",
        icon:
          ":bg-grey1/50 dark::bg-backgtound/50",
        roundButton:
          ": border-3 border-grey5 bg-white ",
        link: "text-grey1 underline-offset-4 underline",
        disabled: 'opacity-80',
        outline1:
          " bg-transparent  dark:border-primary ",
        tableHeader: 'sm:text-base text-sm 3xl:text-lg rounded-md font-semibold !px-0 text-iconGrey',
        grey:
          "bg-iconGrey  text-white rounded-full hover:bg-iconGrey/90 ",
        alpha:
          "bg-alpha text-white  hover:bg-alpha/90 py-0"
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


const Button = (
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
    const Comp = 'button';

    // Determine if the button should be disabled
    const isDisabled = loading || disabled;

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant: variant,
            size
          }),
          'cursor-pointer',
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {children}
        {loading && <Loader2 className='animate-spin' />}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };


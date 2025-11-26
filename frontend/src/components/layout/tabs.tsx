"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "w-full",
      "flex flex-wrap items-center justify-center gap-2 sm:pb- pb-0",
      "md:justify-start md:gap-6 md:border-b md:border-white/10 md:rounded-none md:p-0 md:pb-0",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const pathname = usePathname()
  const isPatient = pathname === "/dashboard/patient"

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "whitespace-nowrap font-medium transition-all focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-white",
        "disabled:pointer-events-none disabled:opacity-50 cursor-pointer",

        // Mobile pill style
        "px-4 py-2 rounded-full text-sm border mb-0",
        "bg-white border-[#DDE3E8]",

        // Conditionally swap bg-alpha vs bg-primary
        isPatient
          ? "data-[state=active]:bg-alpha"
          : "data-[state=active]:bg-primary",

        "text-primary data-[state=active]:text-white data-[state=active]:border-primary",

        // Desktop underline style
        "md:mb-0 md:px-0 md:py-3 md:rounded-none md:text-base",
        "md:bg-transparent md:border-none md:text-white/80",
        "md:data-[state=active]:bg-transparent md:data-[state=active]:text-white md:data-[state=active]:border-transparent",
        "md:relative md:after:absolute md:after:left-0 md:after:-bottom-[1px] md:after:h-[2px] md:after:w-0 md:after:bg-white/0",
        "md:data-[state=active]:after:w-full md:data-[state=active]:after:bg-white",
        className
      )}
      {...props}
    />
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 md:mt-8 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }

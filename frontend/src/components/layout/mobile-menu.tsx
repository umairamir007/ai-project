import React from 'react'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { navItems } from '@/assets/data/nav-data'

export const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {

    const pathname = usePathname()

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetTrigger />
            <SheetContent side="left" className='px-4'>
                <SheetHeader>
                    <SheetTitle className="flex justify-between">
                        <Link href="/" className='flex items-center gap-2'>
                            <Image src='/images/logo.svg' alt='Logo' width={5} height={50} className='object-contain' />
                            <div className="flex flex-col text-base font-medium gap-0">
                                <span className='text-2xl font-bold leading-5'>Blu Whale</span>
                                <span className='uppercase'>Studios</span>
                            </div>
                        </Link>
                    </SheetTitle>
                </SheetHeader>

                {/* Mode toggle */}
                {/* <ModeToggle /> */}

                <div className="flex flex-col gap-1 space-y-2 mt-4">
                    {navItems.map((item) => (
                        <Link key={item.name} href={item.href} passHref>
                            <p
                                className={cn(
                                    "cursor-pointer p-2 um-transition rounded-md hover:bg-accent-black/50 hover:text-accent-black",
                                    pathname === item.href ? "bg-primary text-white " : "text-muted-black"
                                )}
                                onClick={onClose}
                            >
                                {item.name}
                            </p>
                        </Link>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}

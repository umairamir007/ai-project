'use client';

import React from 'react';
import {
    clinicNavItems,
    patientNavItems,
} from '@/constants/nav-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';
import { usePathname } from 'next/navigation';
import { DashboardNav } from './dashboard-nav';
import { HeartPulse } from 'lucide-react';
import { buttonVariants } from '../ui/button';
import { useCurrentUser } from '@/hooks/user/useUserDetails';
type SidebarProps = {
    className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
    // const { isMinimized, toggle } = useSidebar();
    const isMinimized = false;
    const { data: userData } = useCurrentUser();
    const router = usePathname();
    const isClinicRole = userData.user.roles === "clinic" || userData.user.roles === "admin";
    const isClinicPath = router.startsWith('/dashboard/clinic');
    const navItems = isClinicPath ? clinicNavItems : patientNavItems

    const currentLogoLink = isClinicPath
        ? '/dashboard/clinic'
        : '/dashboard/patient';

    const currentSwitchButtonLink = isClinicPath ? '/dashboard/patient' : "/dashboard/clinic";

    return (
        <aside
            className={cn(
                `fixed top-0 bottom-0 mx-auto hidden h-screen flex-none
         transition-[width] duration-500 xl:block
         rounded-tr-[28px] 
         shadow-[inset_-1px_0_0_0_#2F476B] w-full max-w-[310px]`,
                // !isMinimized ? 'w-68' : 'w-20',
                className
            )}
        >
            <ScrollArea className="h-[calc(100dvh)] ">
                {isMinimized ? (
                    <div className="hidden p-5 pt-9 md:block">
                        <Link
                            href={currentLogoLink}
                            className="w-full items-center justify-center"
                        >
                            <Image
                                src={'/images/logo.svg'}
                                alt="Logo"
                                width={40}
                                height={40}
                                quality={100}
                            />
                        </Link>
                    </div>
                ) : (
                    <div
                        className="
              relative hidden md:block p-5 py-10
              [--border-bottom:oklch(0.922_0_0)]
            "
                    >
                        <Link href={currentLogoLink} className="flex items-center justify-center">
                            <Image
                                src="/images/logo.svg"
                                alt="Logo"
                                width={66}
                                height={78}
                                quality={100}
                            />
                        </Link>
                        <span
                            aria-hidden
                            className="
                pointer-events-none
                absolute inset-x-0 -bottom-px h-px
                bg-gradient-to-r
                from-transparent via-[var(--border-bottom)]/70 to-transparent
                [mask-image:linear-gradient(90deg,transparent,black,transparent)]
                [-webkit-mask-image:linear-gradient(90deg,transparent,black,transparent)]
              "
                        />
                    </div>
                )}

                <div className="space-y-4 py-1 xl:py-5 3xl:py-6 px-3">
                    {
                        isClinicRole && <Link href={currentSwitchButtonLink} className={cn(`w-full`, buttonVariants({ variant: "secondary" }))}>
                            <HeartPulse />
                            Switch To {isClinicPath ? "Patient" : "Clinic"}
                        </Link>
                    }
                    <DashboardNav
                        items={navItems.filter(
                            (item) => !['Notification', 'Cart'].includes(item.title)
                        )}
                        variant={isClinicPath ? 'clinic' : 'patient'}
                    />

                </div>
            </ScrollArea>
        </aside >
    );
}

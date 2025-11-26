'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MobileSidebar } from './mobile-sidebar';
import { cn } from '@/lib/utils';
import { getPackageInfoById } from '@/config';
import UserDropDown from './user-dropdown';
import CartSheet from '../cart/CartSheet';

interface HeadingInfo {
    heading: string;
}

function normalizePath(path: string) {
    if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
    return path;
}

function buildHeadings() {
    const patient = getPackageInfoById('1').label;
    const clinic = getPackageInfoById('2').label;

    const patientBase = `/dashboard/${patient}`;
    const clinicBase = `/dashboard/${clinic}`;

    const patientHeadings: Record<string, HeadingInfo> = {
        [patientBase]: { heading: 'Patient Dashboard' },
        [`${patientBase}/transactions`]: { heading: 'Transactions' },
        [`${patientBase}/product`]: { heading: 'Marketplace' },
        [`${patientBase}/marketplace/checkout`]: { heading: 'Marketplace' },
        [`/dashbaord/marketplace`]: { heading: 'Marketplace' },
        [`${patientBase}/education`]: { heading: 'Education Hub' },
        [`${patientBase}/game`]: { heading: 'Game Tab' },
        [`${patientBase}/orders`]: { heading: 'Order History' },
        [`${patientBase}/feedback`]: { heading: 'Reviews' },
        [`${patientBase}/leaderboard`]: { heading: 'Leaderboard' },


    };

    const clinicHeadings: Record<string, HeadingInfo> = {
        [clinicBase]: { heading: 'Clinic Dashboard' },
        [`${clinicBase}/analytics`]: { heading: 'Analytics' },
        [`${clinicBase}/staff`]: { heading: 'Staff' },
        [`${clinicBase}/leaderboard`]: { heading: 'Leader Board' },
        [`${clinicBase}/rewards`]: { heading: 'Rewards' },
        [`${clinicBase}/products`]: { heading: 'Products' },
        [`${clinicBase}/reports`]: { heading: 'Reports' },
        [`${clinicBase}/subscription`]: { heading: 'Subscription' },
        [`${clinicBase}/setting`]: { heading: 'Setting' },
        [`${clinicBase}/dao`]: { heading: 'DAO Governance' },
        [`/dashboard/marketplace`]: { heading: 'Marketplace' },
        [`${clinicBase}/reviews`]: { heading: 'Reviews' },

    };

    const globals: Record<string, HeadingInfo> = {
        '/': { heading: 'Dashboard' },
    };

    return { map: { ...globals, ...patientHeadings, ...clinicHeadings }, patientBase, clinicBase };
}

function resolveHeading(path: string, map: Record<string, HeadingInfo>): HeadingInfo {
    const normalized = normalizePath(path);
    if (map[normalized]) return map[normalized];

    const parts = normalized.split('/').filter(Boolean);
    while (parts.length > 1) {
        parts.pop();
        const candidate = '/' + parts.join('/');
        if (map[candidate]) return map[candidate];
    }

    return { heading: 'Dashboard' };
}

export default function HeaderDashboard() {
    const pathname = usePathname();
    const path = normalizePath(pathname);
    const { map } = buildHeadings();
    const { heading } = resolveHeading(path, map);

    const [scrolled, setScrolled] = useState(false);

    // 🔥 Detect scroll beyond 20px
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            className={cn(
                'sticky inset-x-0 top-0 z-50 flex flex-col w-full gap-2 p-4 md:px-8 md:pb-4 md:pt-6 2xl:pb-6 transition-all duration-300',
                scrolled
                    ? 'backdrop-blur-lg bg-black/60 shadow-md'
                    : 'bg-transparent'
            )}
        >
            <nav className="flex items-center justify-between gap-4">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-5">
                        <h1
                            className={cn(
                                'text-2xl font-medium text-white md:text-4xl transition-colors duration-300',
                            )}
                        >
                            {heading}
                        </h1>
                    </div>

                    <div className="flex items-center justify-between gap-5">
                        <div className="hidden md:flex items-center gap-4">
                            <UserDropDown />
                        </div>
                    </div>
                </div>

                <div className={cn('flex items-center gap-4 cursor-pointer xl:!hidden')}>
                    <CartSheet />
                    <MobileSidebar />
                </div>
            </nav>
        </div>
    );
}

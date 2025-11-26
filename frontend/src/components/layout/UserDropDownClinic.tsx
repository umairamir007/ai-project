"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowRight, Bell, DollarSign, Settings } from "lucide-react";
import NotificationPanel, { NotificationItem } from "@/components/modals/Notification";
import { useLogout } from "@/hooks/auth/useAuth";
import { useClinics } from "@/hooks/clinic/useClinic";
import { Skeleton } from "@/components/ui/skeleton";
import WalletModal from "../modals/wallet-modal";
import { Button } from "../ui/button";
import CartSheet from "../cart/CartSheet";

export default function UserDropDownClinic() {
    const { data, isFetching } = useClinics();
    const { mutate, isPending } = useLogout();
    const [notifOpen, setNotifOpen] = React.useState(false);

    const base = "dashboard";

    const items: NotificationItem[] = [
        {
            id: 1,
            message: "You have successfully rewarded abc@xyz.com with 10 EyeCoins.",
            dateLabel: "March 1, 2025",
        },
        {
            id: 2,
            message: "A new order has been placed by abc@xyz.com for March 1, 2025",
            dateLabel: "March 1, 2025",
            highlightDateInMessage: true,
        },
        { id: 3, message: "A new DAO proposal has been created.", dateLabel: "March 1, 2025" },
    ];

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                {isFetching ? (
                    <Skeleton className="h-10 w-10 rounded-full" />
                ) : data?.branding?.logoUrl ? (
                    <Image
                        src={data.branding.logoUrl}
                        alt="Clinic logo"
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover"
                        priority
                    />
                ) : null}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        {isFetching ? (
                            <Skeleton className="h-8 w-40" />
                        ) : (
                            <p className="text-white cursor-pointer">{data?.branding?.displayName}</p>
                        )}
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="center"
                        sideOffset={8}
                        className="w-44 rounded-2xl bg-white p-1.5 shadow-xl border border-slate-200/70 dark:bg-[#1C1C1F] dark:border-white/10"
                    >
                        <DropdownMenuGroup>
                            <Link href={`/${base}/clinic/setting`}>
                                <DropdownMenuItem className="cursor-pointer rounded-xl px-2 py-2.5 hover:bg-slate-50 focus:bg-slate-50">
                                    <Settings className="h-4 w-4 text-grey1" strokeWidth={1.75} />
                                    <span className="text-sm text-black">Clinic Settings</span>
                                </DropdownMenuItem>
                            </Link>

                            <div className="mx-2 my-1 h-px bg-slate-200 dark:bg-white/10" />

                            <DropdownMenuItem
                                onClick={() => mutate()}
                                disabled={isPending}
                                className="cursor-pointer rounded-xl px-2 py-2.5 hover:bg-slate-50 focus:bg-slate-50"
                            >
                                <ArrowRight className="h-4 w-4 text-grey1" strokeWidth={1.75} />
                                <span className="text-sm text-black dark:text-slate-100">
                                    {isPending ? "Logging out..." : "Logout"}
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <WalletModal className="hidden xl:block" />

            {/* Cart Sidebar */}
            <div className="hidden xl:block">
                <CartSheet />
            </div>


            {/* Notifications */}
            <Popover open={notifOpen} onOpenChange={setNotifOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost2"
                        size="icon"
                        aria-label="Notifications"
                        aria-haspopup="dialog"
                    >
                        <Bell className="h-5 w-5" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    sideOffset={20}
                    className="p-0 bg-transparent border-0 shadow-none mr-32"
                >
                    <NotificationPanel
                        title="Notifications"
                        items={items}
                        onBack={() => setNotifOpen(false)}
                        showBack={false}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}

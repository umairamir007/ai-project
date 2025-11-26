"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, UserRound, ArrowRight, History } from "lucide-react";
import NotificationPanel, { NotificationItem } from "@/components/modals/Notification";
import { useLogout } from "@/hooks/auth/useAuth";
import CartSheet from "@/components/cart/CartSheet";
import WalletModal from "../modals/wallet-modal";

export default function UserDropDownPatient() {
    const { mutate, isPending } = useLogout();
    const [notifOpen, setNotifOpen] = React.useState(false);

    const base = "dashboard/patient";

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
            {/* User Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost2"
                        size="icon"
                        aria-label="User menu"
                        className="cursor-pointer bg-transparent h-8 w-8 rounded-full "
                    >
                        <UserRound className="h-5 w-5 text-grey4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="center"
                    sideOffset={8}
                    className="w-48 rounded-2xl bg-white p-1.5 shadow-xl border border-slate-200/70"
                >
                    <DropdownMenuGroup>
                        <Link href={`/${base}/profile`}>
                            <DropdownMenuItem className="cursor-pointer rounded-xl px-2 py-2.5 hover:bg-slate-50">
                                <UserRound className="h-4 w-4 text-grey1" strokeWidth={1.75} />
                                <span className="text-sm text-black">Profile</span>
                            </DropdownMenuItem>
                        </Link>


                        {/* <div className="mx-2 my-1 h-px bg-slate-200" />

                        {/* <Link href={`/${base}/wallet`}>
                            <DropdownMenuItem className="cursor-pointer rounded-xl px-2 py-2.5 hover:bg-slate-50">
                                <DollarSign className="h-4 w-4 text-grey1" strokeWidth={1.75} />
                                <span className="text-sm text-black">Wallet</span>
                            </DropdownMenuItem>
                        </Link> */}

                        {/* <div className="mx-2 my-1 h-px bg-slate-200" /> */}

                        <Link href={`/${base}/orders`}>
                            <DropdownMenuItem
                                className="cursor-pointer rounded-xl px-2 py-2.5 hover:bg-slate-50"
                            >
                                <History className="h-4 w-4 text-grey1" strokeWidth={1.75} />
                                <span className="text-sm text-black dark:text-slate-100">
                                    Order History
                                </span>
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                            onClick={() => mutate()}
                            disabled={isPending}
                            className="cursor-pointer rounded-xl px-2 py-2.5hover:bg-slate-50 focus:bg-slate-50"
                        >
                            <ArrowRight className="h-4 w-4 text-grey1" strokeWidth={1.75} />
                            <span className="text-sm text-black dark:text-slate-100">
                                {isPending ? "Logging out..." : "Logout"}
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Wallet Modal */}
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
        </div >
    );
}

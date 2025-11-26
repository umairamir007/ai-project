"use client";

import { SubscriptionExpiredCard } from "@/components/modals/SubscriptionExpiredCard";
import { useEyeCoinContext } from "@/providers/eyecoin.content";

export default function SubscriptionWrapper({ children }: { children: React.ReactNode }) {

    const { isUserPackageExpired } = useEyeCoinContext();

    return <div className="overflow-hidden">
        {isUserPackageExpired && <SubscriptionExpiredCard />}
        {children}
    </div>;
}

"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { useConcludeClinicReward } from "@/hooks/clinic/useClinic";
import { formatWithCommas } from "@/lib/utils";
import { formatCountdown, NotifyError, NotifySuccess } from "@/lib/common";
import { EYE_COIN_ADMIN_EMAIL } from "@/constants";
import { useRewards } from "@/hooks/clinic/useRewards";

interface ShareCardProps {
  onSendClick: (rewardId: string, amount: number) => void;
}

const ShareCard: React.FC<ShareCardProps> = ({ onSendClick }) => {
  const { data, isFetching } = useRewards("recipient", undefined, undefined, 100);
  const [timers, setTimers] = useState<{ [key: string]: string }>({});
  const [activeRewardId, setActiveRewardId] = useState<string | null>(null);

  const { mutateAsync: concludeClinicReward, isPending } =
    useConcludeClinicReward(activeRewardId || "");

  useEffect(() => {
    if (!data?.items) return;
    const updateTimers = () => {
      const newTimers: { [key: string]: string } = {};
      data.items.forEach((item: any) => {
        newTimers[item._id] = formatCountdown(item.expiresAt);
      });
      setTimers(newTimers);
    };
    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, [data]);

  const handleDonate = async (rewardId: string, amount: number) => {
    try {
      setActiveRewardId(rewardId);
      await concludeClinicReward({ recipientEmail: EYE_COIN_ADMIN_EMAIL });
      NotifySuccess(`Donated ${amount} EYE successfully!`);
    } catch (error: any) {
      NotifyError(error?.response?.data?.message || "Donation failed");
    } finally {
      setActiveRewardId(null);
    }
  };

  // ⛔️ Hide completely if no data or no items
  if (isFetching || !data?.items?.length) {
    return null;
  }

  // ✅ Render rewards only when present
  return (
    <Card className="p-4 rounded-2xl bg-transparent">
      <CardContent className="space-y-4 p-0 bg-white rounded-2xl">
        {data.items.map((item: any) => {
          const isExpired = timers[item._id] === "00:00:00:00";
          const isThisLoading = isPending && activeRewardId === item._id;

          return (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-grey1 rounded-xl px-4 py-3 gap-3 sm:gap-0"
            >
              <div className="flex items-center space-x-2">
                <Image
                  alt="Eye"
                  src="/images/comission.png"
                  height={24}
                  width={24}
                />
                <span className="text-xl font-bold text-black">
                  {formatWithCommas(item.escrowAmount)}
                </span>
              </div>

              <span className="text-sm text-sec bg-backgroundCard px-3 py-1 rounded-xl text-center sm:text-left">
                {timers[item._id] || "00:00:00:00"}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline2"
                  className="min-28"
                  disabled={isExpired || isThisLoading}
                  loading={isThisLoading}
                  onClick={() => handleDonate(item._id, item.escrowAmount)}
                >
                  {isThisLoading ? "Donating..." : "Donate"}
                </Button>

                <Button
                  onClick={() => onSendClick(item._id, item.escrowAmount)}
                  className="min-w-28 border border-primary"
                  disabled={isExpired || isPending}
                >
                  {isExpired ? "Expired" : "Send"}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ShareCard;

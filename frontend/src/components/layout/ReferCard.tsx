'use client';

import { ArrowRight, Coins, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { usePathname } from "next/navigation";

export function ReferCard({ onOpen }: { onOpen: () => void }) {
    const pathname = usePathname();
    const isPatientDashboard = pathname === "/dashboard/patient";

    return (
        <Card className="rounded-2xl bg-white ring-1 ring-black/5">
            {/* Header */}
            <div
                className="
                    flex flex-col items-center gap-4 px-6
                    text-center
                    sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-8 sm:text-left
                "
            >
                <h2 className="font-semibold text-base sm:text-xl 3xl:text-2xl">
                    Refer & Earn
                </h2>

                <Button
                    onClick={onOpen}
                    className="
                        h-11 sm:h-12 w-32 sm:w-40 rounded-full bg-alpha px-5 sm:px-6
                        font-medium text-white hover:opacity-95 transition
                        self-center sm:self-auto
                    "
                >
                    Refer
                </Button>
            </div>

            {/* Body */}
            <div className="px-3 pt-3 sm:px-4">
                <div
                    className="
                        relative rounded-[18px] bg-white ring-1 ring-black/5
                        shadow-[0_22px_48px_rgba(0,0,0,0.10),0_-10px_28px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)]
                        px-3 sm:px-4 py-4
                    "
                >
                    {/* Clinic Refer Card */}
                    {
                        !isPatientDashboard && (
                            <div className="flex flex-col md:flex-row md:flex-nowrap items-stretch gap-5 md:gap-6">

                                <div className="min-w-[min(260px,100%)] flex-1 flex flex-col">
                                    <div className="mb-2 flex items-center gap-2">
                                        <Users className="size-5 sm:size-6 text-black" strokeWidth={2} />
                                        <p className="text-black font-semibold text-base sm:text-sm 3xl:text-xl">
                                            Refer a Clinic
                                        </p>
                                    </div>

                                    <div className="mt-3 sm:mt-4 h-full min-h-[5rem] rounded-md bg-backgroundCard px-3 py-3 sm:py-4">
                                        <p className="text-lightBlack 3xl:text-lg  xl:text-sm text-base">
                                            Share the link with a Clinic
                                        </p>
                                    </div>
                                </div>

                                <div className="hidden md:grid shrink-0 place-items-center pt-14 md:pt-14">
                                    <ArrowRight className="size-6 md:size-6 text-black" />
                                </div>


                                <div className="min-w-[min(260px,100%)] flex-1 flex flex-col">
                                    <div className="mb-2 flex items-center gap-2">
                                        <Coins className="size-8 sm:size-6 text-black" />
                                        <p className="text-black font-semibold text-base sm:text-sm 3xl:text-xl">
                                            Get 1 month free subscription + 1000 free eyecoins
                                        </p>
                                    </div>

                                    <div className="mt-3 sm:mt-4 h-full min-h-[5rem] rounded-md bg-backgroundCard px-3 py-3 sm:py-4">
                                        <p className="text-lightBlack 3xl:text-lg  xl:text-sm text-base">
                                            When a Clinic signs up using your refer link, you will receive 1 month of free subscription
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    {/* <div className="flex flex-col md:flex-row md:flex-nowrap items-stretch gap-5 md:gap-6">

                        <div className="min-w-[min(260px,100%)] flex-1 flex flex-col">
                            <div className="mb-2 flex items-center gap-2">
                                <Users className="size-5 sm:size-6 text-black" strokeWidth={2} />
                                <p className="font-semibold text-black 3xl:text-lg  xl:text-sm text-base">
                                    Refer a Clinic
                                </p>
                            </div>

                            <div className="mt-3 sm:mt-4 h-full min-h-[5rem] rounded-md bg-[#F4F4F4] px-3 py-3 sm:py-4">
                                <p className="text-black 3xl:text-lg  xl:text-sm text-base">
                                    Share the link with a Clinic
                                </p>
                            </div>
                        </div>

                        <div className="hidden md:grid shrink-0 place-items-center pt-14 md:pt-14">
                            <ArrowRight className="size-6 md:size-6 text-[#000000]" />
                        </div>


                        <div className="min-w-[min(260px,100%)] flex-1 flex flex-col">
                            <div className="mb-2 flex items-center gap-2">
                                <Coins className="size-8 sm:size-6 text-black" />
                                <p className="font-semibold text-black 3xl:text-lg  xl:text-sm text-base">
                                    Get 1 month free subscription + 1000 free eyecoins
                                </p>
                            </div>

                            <div className="mt-3 sm:mt-4 h-full min-h-[5rem] rounded-md bg-[#F4F4F4] px-3 py-3 sm:py-4">
                                <p className="text-black 3xl:text-lg  xl:text-sm text-base">
                                    When a Clinic signs up using your refer link, you will receive 1 month of free subscription
                                </p>
                            </div>
                        </div>
                    </div> */}

                    {/* Patient Refer Card — show only if NOT on /dashboard/patient */}
                    {isPatientDashboard && (
                        <div className="flex flex-col md:flex-row md:flex-nowrap items-stretch gap-5 md:gap-6 mt-8">
                            <div className="min-w-[min(260px,100%)] flex-1 flex flex-col">
                                <div className="mb-2 flex items-center gap-2">
                                    <Users className="size-5 sm:size-6 text-black" strokeWidth={2} />
                                    <p className="text-black font-semibold text-base sm:text-lg 3xl:text-xl">
                                        Refer a friend
                                    </p>
                                </div>

                                <div className="mt-3 sm:mt-4 h-full min-h-[5rem] rounded-md bg-[#F4F4F4] px-3 py-3 sm:py-4">
                                    <p className="text-lightBlack 3xl:text-lg  xl:text-sm text-base">
                                        Share the link with a friend
                                    </p>
                                </div>
                            </div>

                            <div className="hidden md:grid shrink-0 place-items-center pt-14 md:pt-14">
                                <ArrowRight className="size-6 md:size-6 text-[#000000]" />
                            </div>

                            <div className="min-w-[min(260px,100%)] flex-1 flex flex-col">
                                <div className="mb-2 flex items-center gap-2">
                                    <Coins className="size-5 sm:size-6 text-black" strokeWidth={2} />
                                    <p className="text-black font-semibold text-base sm:text-lg 3xl:text-xl">
                                        Get 5 free eyecoins
                                    </p>
                                </div>

                                <div className="mt-3 sm:mt-4 h-full min-h-[5rem] rounded-md bg-[#F4F4F4] px-3 py-3 sm:py-4">
                                    <p className="text-lightBlack 3xl:text-lg  xl:text-sm text-base">
                                        When a friend signs up using your refer link, you will receive 5 free eyecoins
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}

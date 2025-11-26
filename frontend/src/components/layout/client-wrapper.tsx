'use client';

import React, { Suspense } from 'react';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export default function ClientWrapper({ children }: { children: React.ReactNode }) {

    return (
        <>
            <Suspense fallback={null}>
                <NextTopLoader color={"#425469"} height={5} showSpinner={false} />
            </Suspense>

            <Suspense fallback={null}>
                <Toaster position="top-center" />
            </Suspense>

            <Suspense fallback={null}>
                <QueryClientProvider client={queryClient}>
                    <main>
                        {children}
                    </main>
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </Suspense>
        </>
    );
}

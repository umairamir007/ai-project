import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = false
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className="h-[calc(100dvh-30px)] w-full max-w-full">
          <div className="h-full w-full max-w-full p-2 py-6 md:px-6 px-4 xl:px-8">
            {children}
          </div>
        </ScrollArea>
      ) : (
        <div className="h-full p-4 md:px-8 w-full max-w-full">{children}</div>
      )}
    </>
  );
}


import React from 'react';
import { ScrollArea } from './scroll-area';


export default function PageContainer({
  children,
  scrollable = false
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
        <div className="h-full py-10 px-4 max-w-7xl border-2 border-red-600 mx-auto">{children}</div>
      )}
    </>
  );
}

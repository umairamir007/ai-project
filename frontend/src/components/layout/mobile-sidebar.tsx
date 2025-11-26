'use client';

import { DashboardNav } from '@/components/layout/dashboard-nav';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  clinicNavItems,
  patientNavItems
} from '@/constants/nav-data';
import { HeartPulse, MenuIcon, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import PageContainer from './page-container';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useCurrentUser } from '@/hooks/user/useUserDetails';
import { Button, buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import WalletModal from '../modals/wallet-modal';
import { useLogout } from '@/hooks/auth/useAuth';

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { mutate, isPending } = useLogout();

  const isClinicPath = pathname.startsWith('/dashboard/clinic');
  const isAdminPath = pathname.startsWith('/dashboard/admin')
  const navVariant = isClinicPath ? 'clinic' : 'patient';

  const { data: userData } = useCurrentUser();

  const isClinicRole = userData.user.roles === "clinic" || userData.user.roles === "admin";

  const navItems = isClinicPath ? clinicNavItems : patientNavItems

  const currentSwitchButtonLink = isClinicPath ? '/dashboard/patient' : "/dashboard/clinic";

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon color="#ffffff" />
        </SheetTrigger>
        <SheetContent side="left" className="w-[22rem] bg-sidebar !px-0  rounded-tr-[28px] overflow-hidden
     shadow-[inset_-1px_0_0_0_#2F476B] border-r-2">
          <SheetHeader className="flex flex-row relative items-start justify-between gap-5 px-4 pb-4 xl:pb-0  py-10">
            <Link href={`/dashboard/${navVariant}`} className='w-full'>
              <Image
                src={'/images/logo.svg'}
                alt="Logo"
                width={120}
                height={120}
                quality={100}
                className='mx-auto sm:w-[120px] w-20'
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
            <SheetClose asChild className='absolute top-0 right-2'>
              {/* <Button
                variant="ghost"
                style={{ marginTop: '0px' }}
                className="h-7 w-7 p-0"
              >
                <X size={24} color="#ffffff" />
              </Button> */}
            </SheetClose>
          </SheetHeader>
          <PageContainer scrollable>
            <div className="space-y-4 py-0 xl:py-4">
              <div className="pr-2 py-0 xl:py-2">
                <ScrollArea className="h-[calc(100dvh-4rem)]">
                  <div className="space-y-3">
                    {
                      !isAdminPath && isClinicRole && <Link href={currentSwitchButtonLink} className={cn(`w-full`, buttonVariants({ variant: "secondary" }))}>
                        <HeartPulse />
                        Switch To {isClinicPath ? "Patient" : "Clinic"}
                      </Link>
                    }

                    <WalletModal isMobile />
                    <DashboardNav
                      items={navItems}
                      isMobileNav={true}
                      setOpen={setOpen}
                      variant={navVariant}
                    />
                    <Button
                      variant="destructive"
                      className='w-full bg-destructive'
                      onClick={() => mutate()}
                    >{isPending ? "Logging out..." : "Logout"}
                    </Button>


                  </div>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />

                </ScrollArea>
              </div>
            </div>
          </PageContainer>
        </SheetContent>
      </Sheet>
    </>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/layout/icons';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { NavItem } from '@/types';

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
  variant?: 'clinic' | 'patient' | 'admin';
}

type ImageModule = {
  src: string | StaticImageData;
  height: number;
  width: number;
  blurDataURL?: string;
};
type IconComponentType = React.ElementType | ImageModule;

function isImageModule(component: IconComponentType): component is ImageModule {
  return (
    typeof component === 'object' &&
    component !== null &&
    'src' in component &&
    'height' in component &&
    'width' in component
  );
}

/** Match /a/b as active for href=/a and href=/a/b, but avoid /abc */
function pathStartsWith(path: string, href?: string) {
  if (!href) return false;
  if (href === '/') return path === '/';
  return path === href || path.startsWith(href + '/');
}

/** Collect all hrefs (top-level + subItems) */
function collectHrefs(items: NavItem[]): string[] {
  const hrefs: string[] = [];
  for (const it of items) {
    if (it.href) hrefs.push(it.href);
    if (it.subItems?.length) {
      for (const sub of it.subItems) {
        if (sub.href) hrefs.push(sub.href);
      }
    }
  }
  return hrefs;
}

/** Pick the single, most specific (longest) href that matches the current path */
function longestMatchingHref(path: string, items: NavItem[]): string | null {
  const matches = collectHrefs(items).filter((h) => pathStartsWith(path, h));
  if (matches.length === 0) return null;
  return matches.sort((a, b) => b.length - a.length)[0];
}

export function DashboardNav({
  items,
  setOpen,
  isMobileNav = false,
  variant = 'patient'
}: DashboardNavProps) {
  const path = usePathname();
  const isMinimized = false; // if you have a sidebar store, wire it here
  const [openDropdown, setOpenDropdown] = useState<Record<string, boolean>>({});

  // Determine the ONE active href (most specific match)
  const currentActiveHref = longestMatchingHref(path, items);
  const isAnyRouteMatched = !!currentActiveHref;

  const handleToggleDropdown = (title: string) => {
    setOpenDropdown((prevState) => ({
      ...prevState,
      [title]: !prevState[title]
    }));
  };

  // A group is considered "active/open" if currentActiveHref falls under it
  const groupContainsActive = (item: NavItem) => {
    if (pathStartsWith(currentActiveHref || '', item.href)) return true;
    if (item.subItems?.length) {
      return item.subItems.some((s) => pathStartsWith(currentActiveHref || '', s.href));
    }
    return false;
  };

  if (!items?.length) return null;

  const activeBg = variant === 'clinic' ? 'bg-primary' : 'bg-alpha';
  const activeIconText = variant === 'clinic' ? 'text-primary' : 'text-alpha';
  const hoverBg = variant === 'clinic' ? 'hover:bg-primary' : 'hover:bg-alpha';

  return (
    <nav className="flex w-full flex-col items-start justify-center gap-2 xl:items-center">
      <div className="grid w-full items-start gap-2">
        <TooltipProvider>
          {items.map((item, index) => {
            const IconComponent = Icons[item.icon || 'chevronDown'] as IconComponentType;
            const hasSubItems = (item.subItems?.length ?? 0) > 0;

            // Open dropdown if user toggled OR current route is inside this group
            const groupIsActive = groupContainsActive(item);
            const isOpen = openDropdown[item.title] || (hasSubItems && groupIsActive);

            // For simple links, active if exactly equals the longest match
            const isActiveLink =
              (!!item.href && currentActiveHref === item.href) ||
              (!isAnyRouteMatched && index === 0);

            return (
              <div key={index}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    {hasSubItems ? (
                      <div
                        className={cn(
                          'flex items-center gap-2 overflow-hidden rounded-md py-2 text-lg font-medium transition-all duration-300 ease-in-out hover:bg-accent hover:text-accent-foreground hover:duration-300',
                          item.disabled && 'cursor-not-allowed opacity-80',
                          'cursor-pointer'
                        )}
                        onClick={() => handleToggleDropdown(item.title)}
                      >
                        {isImageModule(IconComponent) ? (
                          <Image
                            width={20}
                            height={20}
                            src={IconComponent.src}
                            alt={`${item.label}`}
                            className="ml-3 h-full w-5 flex-none text-current"
                          />
                        ) : (
                          <IconComponent className="ml-3 h-full w-5 flex-none text-current" />
                        )}

                        {isMobileNav || (!isMinimized && !isMobileNav) ? (
                          <span className="mr-2 truncate">{item.title}</span>
                        ) : (
                          ''
                        )}

                        {!isMinimized && hasSubItems && (
                          <Icons.chevronDown
                            className={cn(
                              'ml-auto mr-3 h-5 w-5 transition-transform duration-300',
                              isOpen ? 'rotate-180' : 'rotate-0'
                            )}
                          />
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href || '/'}
                        className={cn(
                          'group mx-1 my-1 flex h-14 items-center gap-3 rounded-2xl px-2 text-lg leading-none transition-all',
                          isActiveLink
                            ? `${activeBg} text-white`
                            : `text-grey1 ${hoverBg} hover:text-white`,
                          item.disabled && 'cursor-not-allowed opacity-80'
                        )}
                        onClick={() => setOpen?.(false)}
                      >
                        {/* ICON TILE */}
                        <div
                          className={cn(
                            'grid h-11 w-12 place-items-center rounded-xl shrink-0',
                            isActiveLink
                              ? `bg-white ${activeIconText}`
                              : cn(
                                (variant === 'patient' || variant === 'admin') &&
                                '',
                                'text-grey3 group-hover:bg-white/10 group-hover:text-white'
                              )
                          )}
                        >
                          {isImageModule(IconComponent) ? (
                            <Image
                              src={IconComponent.src}
                              alt={`${item.label}`}
                              width={24}
                              height={24}
                              className="block h-6 w-6 object-contain"
                            />
                          ) : (
                            <IconComponent className="block h-6 w-6" />
                          )}
                        </div>

                        {(isMobileNav || (!isMinimized && !isMobileNav)) && (
                          <span className="mr-3 truncate leading-none">{item.title}</span>
                        )}
                      </Link>
                    )}
                  </TooltipTrigger>

                  <TooltipContent
                    align="center"
                    side="right"
                    sideOffset={8}
                    className={!isMinimized ? 'hidden' : 'inline-block'}
                  >
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              </div>
            );
          })}
        </TooltipProvider>
      </div>


      {/* <br className="block mt-20 sm:hidden" /> */}
    </nav>
  );
}

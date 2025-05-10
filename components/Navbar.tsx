"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function Navbar() {
  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed top-0 right-0 left-0 z-50 flex h-12 items-center border-b px-10 shadow-sm backdrop-blur">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={cn(navigationMenuTriggerStyle(), "hover:bg-muted/50 bg-transparent")}
              asChild
            >
              <Link href="/">
                <span className="text-2xl font-bold">
                  <span className="text-avi-purple dark:text-avi-green font-bold uppercase">n</span>
                  <span className="text-avi-green dark:text-avi-purple">/</span>
                  <span className="text-avi-purple dark:text-avi-green uppercase">avi</span>
                </span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={cn(navigationMenuTriggerStyle(), "hover:bg-muted/50 bg-transparent")}
              asChild
            >
              <Link href={""}>n/avi</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={cn(navigationMenuTriggerStyle(), "hover:bg-muted/50 bg-transparent")}
              asChild
            >
              <Link href={""}>n/avi</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={cn(navigationMenuTriggerStyle(), "hover:bg-muted/50 bg-transparent")}
              asChild
            >
              <Link href={""}>n/avi</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

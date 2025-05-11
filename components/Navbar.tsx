"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Import NavigationMenu components
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// Import Avatar components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Import Popover components
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Navbar() {
  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed top-0 right-0 left-0 z-50 flex h-12 items-center border-b px-10 shadow-sm backdrop-blur">
      {/* Logo or Brand */}
      <div className="mr-4">
        <Link href="/" className="text-lg font-bold">
          n/avi
        </Link>
      </div>

      {/* Primary nav links */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" className={navigationMenuTriggerStyle()}>
              Home
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/dashboard" className={navigationMenuTriggerStyle()}>
              Dashboard
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Profile Popover */}
      <div className="ml-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar.png" alt="User avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </PopoverTrigger>
              <PopoverContent side="bottom" align="end" className="w-44 p-2">
                <div className="flex flex-col space-y-1">
                  <Link href="/dashboard" className="block w-full px-2 py-1 hover:bg-accent rounded">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="block w-full px-2 py-1 hover:bg-accent rounded">
                    Profile
                  </Link>
                  <Link href="/settings" className="block w-full px-2 py-1 hover:bg-accent rounded">
                    Settings
                  </Link>
                  {/* Match the Link styling exactly for the button */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-left justify-start font-normal px-2 py-1 h-auto hover:bg-accent rounded">
                    Sign out
                  </Button>
      </div>
    </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
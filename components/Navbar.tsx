"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useMedicalStore } from "@/lib/store";
import { Loader2 } from "lucide-react";

// Import NavigationMenu components
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// Import Avatar components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Import Popover components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "./ui/separator";

export function Navbar() {
  const isSignedIn = useMedicalStore((state) => state.isSignedIn);
  const signIn = useMedicalStore((state) => state.signIn);
  const signOut = useMedicalStore((state) => state.signOut);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    setIsLoading(true);
    // Simulate authentication delay
    setTimeout(() => {
      signIn();
      setIsLoading(false);
    }, 1200); // 1.2 second delay to simulate authentication
  };

  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed top-0 right-0 left-0 z-50 flex h-12 items-center border-b px-10 shadow-sm backdrop-blur">
      {/* Primary nav links */}
      <NavigationMenu className="w-full">
        <NavigationMenuList className="flex w-full justify-center md:justify-start">
          <NavigationMenuItem>
            <Link
              href="/"
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent text-2xl font-bold hover:bg-transparent",
              )}
            >
              n/avi
            </Link>
          </NavigationMenuItem>
          {isSignedIn && (
            <>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "hover:bg-avi-green/20 bg-transparent transition-all duration-300",
                  )}
                  asChild
                >
                  <Link href="/onboarding">Onboarding</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "hover:bg-avi-green/20 bg-transparent transition-all duration-300",
                  )}
                  asChild
                >
                  <Link href="/dashboard">Dashboard</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "hover:bg-avi-green/20 bg-transparent transition-all duration-300",
                  )}
                  asChild
                >
                  <Link href="/appointments">Appointments</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Profile Popover or Sign In button */}
      <div className="ml-auto">
        {isSignedIn ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 p-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/avatar.png" alt="User avatar" />
                  <AvatarFallback>MU</AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="end" className="w-44 p-2">
              <div className="flex flex-col space-y-1">
                <Link href="/dashboard" className="hover:bg-accent block w-full rounded px-2 py-1">
                  Dashboard
                </Link>
                <Separator />
                <div className="text-muted-foreground block w-full cursor-not-allowed px-2 py-1">
                  Profile
                </div>
                <div className="hover:bg-accent block w-full cursor-pointer rounded px-2 py-1">
                  Settings
                </div>
                <Separator />
                <div
                  onClick={signOut}
                  className="hover:bg-primary/90 bg-primary text-primary-foreground flex w-full cursor-pointer justify-center rounded px-2 py-1"
                >
                  Sign out
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Button
            onClick={handleSignIn}
            variant="default"
            size="sm"
            className="rounded-full px-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

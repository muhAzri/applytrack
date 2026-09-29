"use client";

import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { SignOut, User as UserIcon } from "@phosphor-icons/react";
import { LogoMark } from "@/components/logo-mark";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/locale-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

export function AppHeader() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const tNav = useTranslations("Nav");
  const tDashboard = useTranslations("Dashboard");

  async function handleSignOut() {
    await signOut();
    toast.success(tDashboard("signOutSuccess"));
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark className="size-7" />
          <span className="text-sm font-semibold tracking-tight">{tNav("brand")}</span>
        </Link>

        <div className="flex items-center gap-2">
          <LocaleSwitcher className="hidden sm:inline-flex" />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="gap-2" />}>
                <span className="flex size-6 items-center justify-center rounded-full bg-secondary">
                  <UserIcon weight="bold" className="size-3.5" />
                </span>
                <span className="hidden max-w-40 truncate sm:inline">{user.email}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
                    {user.email}
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
                  <SignOut className="size-4" />
                  {tNav("signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <span className="hidden rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground sm:inline-block">
                {tNav("guestMode")}
              </span>
              <Button render={<Link href="/signup" />} nativeButton={false} size="sm">
                {tNav("createAccount")}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

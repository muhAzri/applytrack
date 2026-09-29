"use client";

import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { SignOut, User as UserIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
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

export function LandingNavbar() {
  const t = useTranslations("Nav");
  const tDashboard = useTranslations("Dashboard");
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    toast.success(tDashboard("signOutSuccess"));
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark className="size-7" />
          <span className="text-sm font-semibold tracking-tight">{t("brand")}</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#fitur" className="transition-colors hover:text-foreground">
            {t("features")}
          </a>
          <a href="#cara-kerja" className="transition-colors hover:text-foreground">
            {t("howItWorks")}
          </a>
          <a href="#mode" className="transition-colors hover:text-foreground">
            {t("guestVsAccount")}
          </a>
        </nav>
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
                  {t("signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !authLoading && (
              <Button
                render={<Link href="/login" />}
                nativeButton={false}
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                {t("login")}
              </Button>
            )
          )}
          <Button render={<Link href="/dashboard" />} nativeButton={false} size="sm">
            {t("start")}
          </Button>
        </div>
      </div>
    </header>
  );
}

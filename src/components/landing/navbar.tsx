import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LogoMark } from "@/components/logo-mark";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/locale-switcher";

export function LandingNavbar() {
  const t = useTranslations("Nav");

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
          <Button
            render={<Link href="/login" />}
            nativeButton={false}
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
          >
            {t("login")}
          </Button>
          <Button render={<Link href="/dashboard" />} nativeButton={false} size="sm">
            {t("start")}
          </Button>
        </div>
      </div>
    </header>
  );
}

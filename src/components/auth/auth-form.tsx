"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { WarningCircle, CircleNotch, EnvelopeSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const t = useTranslations("Auth");
  const { signIn, signUp, isConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const isLogin = mode === "login";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError(t("passwordTooShort"));
      return;
    }

    setSubmitting(true);
    const result = isLogin
      ? await signIn(email, password)
      : await signUp(email, password);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (!isLogin && "needsEmailConfirmation" in result && result.needsEmailConfirmation) {
      setAwaitingConfirmation(true);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (awaitingConfirmation) {
    return (
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <EnvelopeSimple weight="bold" className="size-6 text-primary" />
        </div>
        <div>
          <p className="font-medium">{t("confirmTitle")}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.rich("confirmBody", {
              email,
              b: (chunks) => (
                <span className="font-medium text-foreground">{chunks}</span>
              ),
            })}
          </p>
        </div>
        <Button render={<Link href="/login" />} nativeButton={false} variant="outline" className="mt-2">
          {t("confirmCta")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      {!isConfigured && (
        <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
          <WarningCircle weight="fill" className="mt-0.5 size-4 shrink-0" />
          <p>
            {t("notConfiguredWarning")}{" "}
            <Link href="/dashboard" className="font-medium underline underline-offset-2">
              {t("guestModeLink")}
            </Link>
            .
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{t("emailLabel")}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">{t("passwordLabel")}</Label>
        <Input
          id="password"
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("passwordPlaceholder")}
        />
      </div>

      {error && (
        <p className="flex items-start gap-2 text-sm text-destructive">
          <WarningCircle weight="fill" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
      <Button type="submit" disabled={submitting || !isConfigured} className="mt-1 h-11">
        {submitting && <CircleNotch className="size-4 animate-spin" />}
        {isLogin ? t("submitLogin") : t("submitSignup")}
      </Button>
    </form>
  );
}

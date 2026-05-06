"use client";

import { subscribeToNewsletter } from "@/actions/newsletter";
import { normalizeEmail, validateEmail } from "@/lib/email";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

export function Newsletter() {
  const t = useTranslations("Footer.Newsletter");
  const currentLocale = useLocale();

  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const normalizedEmailAddress = normalizeEmail(email);
    const { isValid, error: validationError } = validateEmail(
      normalizedEmailAddress
    );

    if (!isValid) {
      setSubscribeStatus("error");
      setErrorMessage(validationError || t("subscribe.invalidEmail"));
      setTimeout(() => setSubscribeStatus("idle"), 5000);
      return;
    }

    try {
      setSubscribeStatus("loading");

      const result = await subscribeToNewsletter(
        normalizedEmailAddress,
        currentLocale
      );

      if (!result.success) {
        throw new Error(result.error || t("subscribe.defaultErrorMessage"));
      }

      setSubscribeStatus("success");
      setEmail("");
      setErrorMessage("");
    } catch (error) {
      setSubscribeStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t("subscribe.defaultErrorMessage")
      );
    } finally {
      setTimeout(() => setSubscribeStatus("idle"), 5000);
    }
  };
  return (
    <div className="">
      <div className="mb-3 font-semibold">{t("title")}</div>
      <p className="text-sm mb-3">{t("description")}</p>
      <form onSubmit={handleSubscribe} className="flex flex-col gap-2 max-w-64">
        <div className="flex">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full rounded-l-lg border border-[var(--stroke-default)] bg-[var(--void-elevated)] px-4 py-2 text-[var(--ink-pure)] placeholder:text-[var(--ink-muted)] focus:outline-hidden focus:ring-1 focus:ring-[var(--vellum-500)]"
            disabled={subscribeStatus === "loading"}
          />
          <button
            type="submit"
            disabled={subscribeStatus === "loading"}
            className={cn(
              "rounded-r-lg border border-[var(--stroke-emphasis)] bg-[var(--vellum-wash-strong)] px-4 py-2 text-[var(--vellum-300)] hover:bg-[var(--vellum-wash)]",
              subscribeStatus === "loading"
            )}
            aria-label="Subscribe to newsletter"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        {subscribeStatus === "success" && (
          <p className="text-xs text-green-600 mt-1">
            {t("subscribe.successMessage")}
          </p>
        )}
        {subscribeStatus === "error" && (
          <p className="text-xs text-red-600 mt-1">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}

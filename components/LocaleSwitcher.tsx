"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Locale,
  LOCALE_NAMES,
  routing,
  usePathname,
  useRouter,
} from "@/i18n/routing";
import { useLocaleStore } from "@/stores/localeStore";
import { Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();
  const { dismissLanguageAlert } = useLocaleStore();
  const [, startTransition] = useTransition();

  function onSelectChange(nextLocale: Locale) {
    dismissLanguageAlert();

    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        // { pathname: "/", params: params || {} }, // if your want to redirect to the home page
        { pathname, params: params || {} }, // if your want to redirect to the current page
        { locale: nextLocale }
      );
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="w-fit border-none bg-transparent p-0 text-[var(--ink-secondary)] shadow-none hover:text-[var(--vellum-100)] focus:outline-none dark:bg-transparent"
        aria-label="Select language"
      >
        <Languages className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="observatory-chrome border-[var(--stroke-default)] bg-[var(--void-rise)] text-[var(--ink-primary)]"
      >
        <DropdownMenuRadioGroup value={locale} onValueChange={onSelectChange}>
          {routing.locales.map((cur) => (
            <DropdownMenuRadioItem
              key={cur}
              value={cur}
              className="focus:bg-[var(--vellum-wash)] focus:text-[var(--vellum-100)]"
            >
              {LOCALE_NAMES[cur]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

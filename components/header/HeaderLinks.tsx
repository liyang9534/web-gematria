"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link as I18nLink, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { HeaderLink } from "@/types/common";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

const HeaderLinks = () => {
  const tHeader = useTranslations("Header");
  const pathname = usePathname();

  const headerLinks: HeaderLink[] = tHeader.raw("links");
  const pricingLink = headerLinks.find((link) => link.id === "pricing");
  if (pricingLink) {
    pricingLink.href = process.env.NEXT_PUBLIC_PRICING_PATH || "/#pricing";
  }

  return (
    <NavigationMenu viewport={false} className="hidden lg:block">
      <NavigationMenuList className="flex-wrap">
        {headerLinks.map((link) => (
          <NavigationMenuItem key={link.name}>
            {link.items ? (
              <>
                <NavigationMenuTrigger className="bg-transparent rounded-xl px-4 py-2 flex items-center gap-x-1 hover:bg-[var(--vellum-wash)] hover:text-[var(--vellum-100)] text-sm font-normal text-[var(--ink-secondary)]">
                  {link.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="observatory-chrome border-[var(--stroke-default)] bg-[var(--void-rise)] text-[var(--ink-primary)]">
                  <ul className="w-[250px] gap-1">
                    {link.items.map((child) => (
                      <li
                        key={child.name}
                        className="hover:bg-[var(--vellum-wash)]"
                      >
                        <NavigationMenuLink asChild>
                          <I18nLink
                            href={child.href}
                            title={child.name}
                            prefetch={
                              child.target && child.target === "_blank"
                                ? false
                                : true
                            }
                            target={child.target || "_self"}
                            rel={child.rel || undefined}
                            className={cn(
                              "flex flex-col gap-y-1 text-sm text-[var(--ink-secondary)] hover:bg-[var(--vellum-wash)] hover:text-[var(--vellum-100)] focus:bg-[var(--vellum-wash)] focus:text-[var(--vellum-100)]"
                            )}
                          >
                            <div className="flex items-center gap-x-1">
                              {child.name}
                              {child.target === "_blank" && (
                                <span className="text-xs">
                                  <ExternalLink className="w-4 h-4" />
                                </span>
                              )}
                            </div>
                            {child.description && (
                              <div className="text-xs text-[var(--ink-muted)]">
                                {child.description}
                              </div>
                            )}
                          </I18nLink>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <I18nLink
                key={link.name}
                href={link.href}
                title={link.name}
                prefetch={
                  link.target && link.target === "_blank" ? false : true
                }
                target={link.target || "_self"}
                rel={link.rel || undefined}
                className={cn(
                  "bg-transparent rounded-xl px-4 py-2 flex items-center gap-x-1 text-sm font-normal text-[var(--ink-secondary)] hover:bg-[var(--vellum-wash)] hover:text-[var(--vellum-100)]",
                  pathname === link.href && "font-medium text-[var(--vellum-500)]"
                )}
              >
                {link.name}
                {link.target === "_blank" && (
                  <span className="text-xs">
                    <ExternalLink className="w-4 h-4" />
                  </span>
                )}
              </I18nLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default HeaderLinks;

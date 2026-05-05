"use client";

import { Button } from "@/components/ui/button";
import {
  INSTAGRAM_SHARE_URL,
  TIKTOK_SHARE_URL,
  buildShareCardUrl,
  createShareCardDownloadName,
  createShareLinkText,
  createSocialShareUrls,
  createXIntentUrl,
  type ShareCardInput,
} from "@/lib/share-cards";
import { cn } from "@/lib/utils";
import { Check, Copy, Download, Mail, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Instagram, TwitterX } from "@/components/social-icons/icons";
import {
  SiFacebook,
  SiLinkedin,
  SiPinterest,
  SiReddit,
  SiTelegram,
  SiThreads,
  SiWhatsapp,
} from "react-icons/si";

interface ShareCardActionsProps {
  input: ShareCardInput;
  variant?: "full" | "compact";
  className?: string;
}

export function ShareCardActions({
  input,
  variant = "full",
  className,
}: ShareCardActionsProps) {
  const [copied, setCopied] = useState(false);
  const imageUrl = buildShareCardUrl(input);
  const morePlatformUrls = createSocialShareUrls(input);
  const isCompact = variant === "compact";

  async function downloadImage() {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Image generation failed");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = createShareCardDownloadName(input);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
      toast.success("Share card downloaded");
    } catch {
      toast.error("Could not download the share card.");
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(createShareLinkText(input));
    setCopied(true);
    toast.success("Link copied");
    window.setTimeout(() => setCopied(false), 1600);
  }

  function openUploadTarget(url: string, label: string) {
    toast.info(`Download the image first, then upload it to ${label}.`);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div
      className={cn(
        "min-w-0 space-y-2",
        isCompact ? "max-w-full" : "w-full max-w-xl",
        className,
      )}
    >
      <Button
        type="button"
        onClick={downloadImage}
        className={cn(
          "min-h-11 w-full rounded-[3px] border border-[rgba(216,207,232,0.35)] bg-[var(--cloister-500)] text-[var(--ink-pure)] shadow-[0_0_24px_rgba(107,91,149,0.22)] hover:bg-[var(--cloister-700)]",
          isCompact && "text-xs",
        )}
      >
        <Download className="size-4" />
        Download image
      </Button>

      <div className="grid min-w-0 grid-cols-3 gap-2">
        <Button
          asChild
          variant="outline"
          className="observatory-button min-w-0 px-2 text-xs"
        >
          <a href={createXIntentUrl(input)} target="_blank" rel="noreferrer">
            <TwitterX className="size-4 shrink-0" />
            <span className="truncate">X</span>
          </a>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => openUploadTarget(INSTAGRAM_SHARE_URL, "Instagram")}
          className="observatory-button min-w-0 px-2 text-xs"
        >
          <Instagram className="size-4 shrink-0 fill-current" />
          <span className="truncate">Instagram</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => openUploadTarget(TIKTOK_SHARE_URL, "TikTok")}
          className="observatory-button min-w-0 px-2 text-xs"
        >
          <Upload className="size-4 shrink-0" />
          <span className="truncate">TikTok</span>
        </Button>
      </div>

      <div className="grid min-w-0 grid-cols-4 gap-2">
        <PlatformLink href={morePlatformUrls.facebook} label="Facebook">
          <SiFacebook className="size-4" />
        </PlatformLink>
        <PlatformLink href={morePlatformUrls.linkedin} label="LinkedIn">
          <SiLinkedin className="size-4" />
        </PlatformLink>
        <PlatformLink href={morePlatformUrls.whatsapp} label="WhatsApp">
          <SiWhatsapp className="size-4" />
        </PlatformLink>
        <PlatformLink href={morePlatformUrls.telegram} label="Telegram">
          <SiTelegram className="size-4" />
        </PlatformLink>
        <PlatformLink href={morePlatformUrls.reddit} label="Reddit">
          <SiReddit className="size-4" />
        </PlatformLink>
        <PlatformLink href={morePlatformUrls.threads} label="Threads">
          <SiThreads className="size-4" />
        </PlatformLink>
        <PlatformLink href={morePlatformUrls.pinterest} label="Pinterest">
          <SiPinterest className="size-4" />
        </PlatformLink>
        <PlatformLink href={morePlatformUrls.email} label="Email">
          <Mail className="size-4" />
        </PlatformLink>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={copyLink}
        className="min-h-10 w-full rounded-[3px] border-[var(--stroke-default)] bg-transparent text-xs text-[var(--ink-secondary)] hover:border-[var(--stroke-active)] hover:text-[var(--vellum-300)]"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        Copy link
      </Button>
    </div>
  );
}

function PlatformLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      asChild
      variant="outline"
      className="min-h-10 min-w-0 rounded-[3px] border-[var(--stroke-default)] bg-transparent px-2 text-xs text-[var(--ink-secondary)] hover:border-[var(--stroke-active)] hover:text-[var(--vellum-300)]"
    >
      <a href={href} target="_blank" rel="noreferrer" aria-label={`Share on ${label}`}>
        {children}
        <span className="sr-only">{label}</span>
      </a>
    </Button>
  );
}

"use client";

import { SourceBadge } from "@/components/mystic/SourceBadge";
import { ShareCardActions } from "@/components/shared/ShareCardActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/routing";
import { calculateMyAngelNumberProfile } from "@/lib/numerology";
import { buildPublicUrl } from "@/lib/site-url";
import type { MyAngelNumberResult } from "@/types/numerology";
import { ArrowRight, CalendarDays, UserRound } from "lucide-react";
import { useMemo, useState } from "react";

export function MyAngelNumberCalculator({
  baseUrl = buildPublicUrl("/calculator/my-angel-number"),
}: {
  baseUrl?: string;
}) {
  const [fullName, setFullName] = useState("Sarah");
  const [birthday, setBirthday] = useState("1990-07-24");
  const profile = useMemo(
    () => calculateMyAngelNumberProfile({ fullName, birthday }),
    [fullName, birthday],
  );

  return (
    <div className="min-w-0 space-y-6">
      <div className="observatory-card min-w-0 p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="my-angel-birthday">Birthday</Label>
            <Input
              id="my-angel-birthday"
              type="date"
              value={birthday}
              onChange={(event) => setBirthday(event.target.value)}
              className="h-12 rounded-[4px] border-[var(--stroke-default)] bg-[var(--void-elevated)] text-[var(--ink-pure)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="my-angel-name">Full name</Label>
            <Input
              id="my-angel-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Enter a name"
              className="h-12 rounded-[4px] border-[var(--stroke-default)] bg-[var(--void-elevated)] text-[var(--ink-pure)] placeholder:text-[var(--ink-muted)]"
            />
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-[var(--ink-secondary)]">
          Use either field or both. The birthday method follows date digits; the
          name method follows A=1 through Z=26.
        </p>
      </div>

      {profile.primary ? (
        <section className="observatory-card overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[0.78fr_1fr]">
            <div className="border-b border-[var(--stroke-hairline)] bg-[var(--vellum-wash)] p-6 lg:border-b-0 lg:border-r">
              <SourceBadge tone="angel">Primary result</SourceBadge>
              <div className="observatory-mono mt-8 text-8xl font-light leading-none text-[var(--vellum-300)] [text-shadow:var(--glow-vellum)]">
                {profile.primary.value}
              </div>
              <h2 className="observatory-display mt-5 text-3xl text-[var(--ink-pure)]">
                Your angel number is {profile.primary.value}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--ink-secondary)]">
                {profile.primary.meaning}
              </p>
            </div>
            <div className="space-y-5 p-6">
              <p className="text-sm leading-7 text-[var(--ink-secondary)]">
                This calculator gives you a quick personal entrance into the
                angel number database. For a fuller numerology profile, continue
                to the complete calculator after reviewing your result.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" className="observatory-button">
                  <Link href={`/angel-number/${profile.primary.value}`}>
                    Read angel number {profile.primary.value}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="observatory-button">
                  <Link href="/calculator/numerology">
                    Open full numerology
                  </Link>
                </Button>
              </div>
              <ShareCardActions
                input={{
                  tool: "angel",
                  number: String(profile.primary.value),
                  resultUrl: baseUrl,
                }}
                variant="compact"
              />
            </div>
          </div>
        </section>
      ) : (
        <div className="observatory-card p-6">
          <SourceBadge tone="angel">Waiting for input</SourceBadge>
          <p className="mt-4 text-sm leading-6 text-[var(--ink-secondary)]">
            Enter a birthday, a name, or both to calculate your personal angel
            number.
          </p>
        </div>
      )}

      {profile.results.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {profile.results.map((result) => (
            <MethodCard key={result.method} result={result} baseUrl={baseUrl} />
          ))}
        </div>
      )}
    </div>
  );
}

function MethodCard({
  result,
  baseUrl,
}: {
  result: MyAngelNumberResult;
  baseUrl: string;
}) {
  const Icon = result.method === "birthday" ? CalendarDays : UserRound;

  return (
    <article className="observatory-card min-w-0 p-5">
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-[4px] border border-[var(--stroke-default)] bg-[var(--cloister-wash)] text-[var(--cloister-100)]">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 space-y-3">
          <SourceBadge tone={result.method === "birthday" ? "numerology" : "angel"}>
            {result.label}
          </SourceBadge>
          <div className="observatory-mono text-5xl font-light text-[var(--vellum-300)]">
            {result.value}
          </div>
          <p className="observatory-mono text-xs leading-5 text-[var(--ink-secondary)]">
            {result.calculation}
          </p>
          <p className="text-sm leading-6 text-[var(--ink-secondary)]">
            {result.description}
          </p>
          <Button asChild variant="outline" className="observatory-button h-auto min-h-11 whitespace-normal px-3 py-2 text-left text-xs">
            <Link href={`/angel-number/${result.value}`}>
              {result.value} also carries meaning as an Angel Number
            </Link>
          </Button>
          <ShareCardActions
            input={{
              tool: "angel",
              number: String(result.value),
              resultUrl: baseUrl,
            }}
            variant="compact"
          />
        </div>
      </div>
    </article>
  );
}

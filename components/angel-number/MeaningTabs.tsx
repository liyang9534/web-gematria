"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { AngelNumberMeaningSet } from "@/types/angel-number";

interface MeaningTabsProps {
  meanings: AngelNumberMeaningSet;
}

const tabs = [
  { key: "love", label: "Love", symbol: "♡" },
  { key: "career", label: "Career", symbol: "◈" },
  { key: "money", label: "Money", symbol: "✦" },
  { key: "spiritual", label: "Spirit", symbol: "❋" },
  { key: "health", label: "Health", symbol: "◇" },
  { key: "twinFlame", label: "Twin Flame", symbol: "✧" },
] as const;

export function MeaningTabs({ meanings }: MeaningTabsProps) {
  return (
    <Tabs defaultValue="love" className="gap-6">
      <div className="relative overflow-x-auto pb-2 [mask-image:linear-gradient(to_right,black_82%,transparent)] md:[mask-image:none]">
        <TabsList className="h-12 w-max gap-8 rounded-none border-0 bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="relative h-11 rounded-none border-0 bg-transparent px-0 pb-3 text-[var(--ink-secondary)] shadow-none transition duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-[var(--vellum-500)] after:transition-transform after:duration-300 data-[state=active]:bg-transparent data-[state=active]:text-[var(--ink-pure)] data-[state=active]:shadow-none data-[state=active]:after:scale-x-100"
            >
              <span aria-hidden="true" className="text-[var(--vellum-500)]">
                {tab.symbol}
              </span>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.key}
          value={tab.key}
          className="observatory-card p-6 text-base leading-8 text-[var(--ink-primary)] md:p-8"
        >
          {meanings[tab.key]}
        </TabsContent>
      ))}
    </Tabs>
  );
}

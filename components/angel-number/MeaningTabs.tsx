"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { AngelNumberMeaningSet } from "@/types/angel-number";
import {
  Activity,
  Briefcase,
  Flame,
  Heart,
  Sparkles,
  WalletCards,
} from "lucide-react";

interface MeaningTabsProps {
  meanings: AngelNumberMeaningSet;
}

const tabs = [
  { key: "love", label: "Love", icon: Heart },
  { key: "career", label: "Career", icon: Briefcase },
  { key: "money", label: "Money", icon: WalletCards },
  { key: "spiritual", label: "Spiritual", icon: Sparkles },
  { key: "health", label: "Health", icon: Activity },
  { key: "twinFlame", label: "Twin Flame", icon: Flame },
] as const;

export function MeaningTabs({ meanings }: MeaningTabsProps) {
  return (
    <Tabs defaultValue="love" className="gap-5">
      <div className="overflow-x-auto pb-1">
        <TabsList className="h-11 w-max rounded-lg border border-white/10 bg-white/[0.06] p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="h-9 rounded-md px-3 text-zinc-300 data-[state=active]:bg-amber-300 data-[state=active]:text-zinc-950"
              >
                <Icon className="size-4" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.key}
          value={tab.key}
          className="rounded-lg border border-white/10 bg-white/[0.055] p-6 text-base leading-8 text-zinc-100 shadow-sm"
        >
          {meanings[tab.key]}
        </TabsContent>
      ))}
    </Tabs>
  );
}

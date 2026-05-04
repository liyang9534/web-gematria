import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { AngelNumberFAQ } from "@/types/angel-number";

interface FAQSectionProps {
  faqs: AngelNumberFAQ[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  return (
    <Accordion type="single" collapsible className="rounded-lg border border-white/10 bg-white/[0.055] px-4">
      {faqs.map((faq, index) => (
        <AccordionItem key={faq.question} value={`faq-${index}`}>
          <AccordionTrigger className="text-left text-base">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-base leading-7 text-zinc-300">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

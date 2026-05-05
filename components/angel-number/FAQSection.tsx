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
    <Accordion
      type="single"
      collapsible
      className="observatory-card px-4 md:px-6"
    >
      {faqs.map((faq, index) => (
        <AccordionItem key={faq.question} value={`faq-${index}`}>
          <AccordionTrigger className="text-left text-base text-[var(--ink-pure)] hover:text-[var(--vellum-300)]">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-base leading-7 text-[var(--ink-secondary)]">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

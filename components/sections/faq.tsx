"use client";

import { useTranslations } from "next-intl";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const t = useTranslations("faq");
  const items = t.raw("questions") as ReadonlyArray<{
    question: string;
    answer: string;
  }>;

  return (
    <section className="py-20 sm:py-24 border-b">
      <div className="container max-w-3xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-block-purple/20 bg-block-purple/10 px-3 py-1 text-xs font-semibold text-block-purple">
            <HelpCircle className="h-3.5 w-3.5" />
            FAQ
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">{t("subtitle")}</p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="mt-10 w-full rounded-2xl border bg-card divide-y divide-border overflow-hidden"
        >
          {items.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-b-0 px-5 sm:px-6"
            >
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline py-5">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

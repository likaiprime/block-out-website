import type { LegalPageContent } from "@/lib/legal-pages";
import {
  AlertCircle,
  Cookie,
  Database,
  FileText,
  Mail,
  Scale,
  Shield,
  type LucideIcon,
} from "lucide-react";

const TILE_COLORS = [
  "bg-block-blue",
  "bg-block-orange",
  "bg-block-green",
  "bg-block-purple",
  "bg-block-yellow",
  "bg-block-red",
];

const ICONS: LucideIcon[] = [
  FileText,
  Mail,
  Database,
  Shield,
  Cookie,
  Scale,
  AlertCircle,
];

export function LegalPage({ content }: { content: LegalPageContent }) {
  return (
    <main className="pt-24 pb-16">
      <section className="container max-w-3xl">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            {content.title}
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">
            {content.subtitle}
          </p>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            {content.lastUpdated}
          </p>
        </header>

        <div className="space-y-5 text-muted-foreground leading-relaxed">
          {content.sections.map((section, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <section
                key={section.title}
                className="rounded-2xl border bg-card p-6 spring-hover hover:border-foreground/15"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className={`block-tile inline-flex h-10 w-10 items-center justify-center text-white ${TILE_COLORS[index % TILE_COLORS.length]}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.25} />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    {section.title}
                  </h2>
                </div>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-3 first:mt-0">
                    {paragraph}
                  </p>
                ))}
                {section.items ? (
                  <ul className="mt-3 list-disc list-inside space-y-2">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}

import type { ReactNode } from "react";
import Container from "./Container";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "paper" | "mist" | "brand";
  eyebrow?: string;
  title?: string;
  lead?: string;
};

const toneClasses: Record<NonNullable<SectionProps["tone"]>, string> = {
  paper: "bg-paper",
  mist: "bg-mist",
  brand: "bg-brand text-paper",
};

export default function Section({
  id,
  children,
  className = "",
  tone = "paper",
  eyebrow,
  title,
  lead,
}: SectionProps) {
  const isOnBrand = tone === "brand";
  return (
    <section id={id} className={`${toneClasses[tone]} py-16 sm:py-24 scroll-mt-20 ${className}`}>
      <Container>
        {(eyebrow || title) && (
          <div className="mb-10 sm:mb-14 text-center">
            {eyebrow && (
              <p
                className={`text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 ${
                  isOnBrand ? "text-accent-light" : "text-brand"
                }`}
              >
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-serif text-2xl sm:text-4xl font-semibold tracking-wide leading-snug">
                {title}
              </h2>
            )}
            {lead && (
              <p
                className={`mt-4 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto ${
                  isOnBrand ? "text-paper/85" : "text-ink-soft"
                }`}
              >
                {lead}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}

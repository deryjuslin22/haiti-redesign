import { CopyBlock } from "@/components/reveal";
import type { ReactNode } from "react";

export function SectionHeading({
  kicker,
  title,
  lede,
}: {
  kicker?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
}) {
  return (
    <CopyBlock
      className="max-w-160"
      kicker={kicker}
      title={title}
      lede={lede}
    />
  );
}

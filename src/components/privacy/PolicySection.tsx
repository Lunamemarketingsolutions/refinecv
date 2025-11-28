import { ReactNode } from 'react';

interface PolicySectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

export default function PolicySection({ id, title, children }: PolicySectionProps) {
  return (
    <section id={id} className="scroll-mt-24 mb-12">
      <h2 className="text-2xl lg:text-3xl font-bold text-secondary mb-6">{title}</h2>
      <div className="text-secondary leading-relaxed space-y-4">{children}</div>
    </section>
  );
}

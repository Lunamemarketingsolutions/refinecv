import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Section {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  sections: Section[];
}

export default function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const timer = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        {
          rootMargin: '-120px 0px -70% 0px',
          threshold: 0.1
        }
      );

      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element && observer) observer.observe(element);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white border-2 border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-primary transition-colors"
        >
          <span className="font-semibold text-secondary">Jump to Section</span>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-secondary" />
          ) : (
            <ChevronDown className="w-5 h-5 text-secondary" />
          )}
        </button>

        {isOpen && (
          <div className="mt-2 bg-white border-2 border-gray-200 rounded-lg p-4 space-y-2">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary text-white font-semibold'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {index + 1}. {section.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <nav
        className="hidden lg:block sticky top-24 w-64 flex-shrink-0"
        aria-label="Table of Contents Navigation"
      >
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-lg text-secondary mb-4">Table of Contents</h3>
          <ul className="space-y-2">
            {sections.map((section, index) => (
              <li key={section.id}>
                <button
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary text-white font-semibold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  aria-current={activeSection === section.id ? 'true' : undefined}
                >
                  {index + 1}. {section.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}

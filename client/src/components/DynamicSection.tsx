import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { WebsiteSection } from "@shared/schema";

interface DynamicSectionProps {
  section: WebsiteSection;
}

type GapSize = 'small' | 'medium' | 'large';

export default function DynamicSection({ section }: DynamicSectionProps) {
  const renderContent = () => {
    switch (section.sectionType) {
      case 'card':
        return (
          <Card className="overflow-hidden">
            {section.imageUrl && (
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={section.imageUrl} 
                  alt={section.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              {section.subtitle && (
                <p className="text-stone-600">{section.subtitle}</p>
              )}
            </CardHeader>
            <CardContent>
              {section.content && (
                <div className="prose prose-stone" dangerouslySetInnerHTML={{ __html: section.content }} />
              )}
              {section.buttonText && section.buttonUrl && (
                <Button
                  onClick={() => window.open(section.buttonUrl || '', "_blank")}
                  className="mt-4"
                >
                  {section.buttonText}
                </Button>
              )}
            </CardContent>
          </Card>
        );

      default:
        return (
          <>
            <h2 className="text-4xl font-bold text-stone-800">{section.title}</h2>
            {section.subtitle && (
              <p className="text-xl text-stone-600">{section.subtitle}</p>
            )}
            {section.content && (
              <div className="prose prose-stone mx-auto" dangerouslySetInnerHTML={{ __html: section.content }} />
            )}
            {section.imageUrl && (
              <img 
                src={section.imageUrl} 
                alt={section.title}
                className="rounded-lg shadow-xl mx-auto"
              />
            )}
            {section.buttonText && section.buttonUrl && (
              <div className="mt-8">
                <Button
                  onClick={() => window.open(section.buttonUrl || '', "_blank")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold"
                >
                  {section.buttonText}
                </Button>
              </div>
            )}
          </>
        );
    }
  };

  const getLayoutClasses = () => {
    const baseClasses = "container mx-auto px-6";
    const gapClasses: Record<GapSize, string> = {
      small: "gap-4",
      medium: "gap-8",
      large: "gap-12"
    };
    
    const gap = (section.gap || 'medium') as GapSize;
    
    switch (section.layout) {
      case 'horizontal':
        return `${baseClasses} flex flex-col md:flex-row ${gapClasses[gap]}`;
      case 'grid':
        const cols = section.columns || 1;
        return `${baseClasses} grid grid-cols-1 md:grid-cols-${cols} ${gapClasses[gap]}`;
      default: // vertical
        return `${baseClasses} flex flex-col ${gapClasses[gap]}`;
    }
  };

  return (
    <section id={section.sectionKey} className="py-20 bg-gradient-to-br from-cream-50 to-stone-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={getLayoutClasses()}
      >
        {renderContent()}
      </motion.div>
    </section>
  );
} 
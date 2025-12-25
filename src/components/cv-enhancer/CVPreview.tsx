import { useEffect, useRef } from 'react';
import { ParsedCV } from '../../services/cvParserService';

interface CVPreviewProps {
  cvData: ParsedCV | null;
  updatedContent: Record<string, string[]>;
}

export default function CVPreview({ cvData, updatedContent }: CVPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cvData || !previewRef.current) return;

    // Merge updated content with original CV data
    const mergedContent = { ...cvData.content };
    for (const [section, bullets] of Object.entries(updatedContent)) {
      mergedContent[section] = bullets;
    }

    // Generate HTML from merged content
    let html = `
      <style>
        /* Formatting styles for preview */
        strong, b {
          font-weight: bold !important;
        }
        em, i {
          font-style: italic !important;
        }
        u {
          text-decoration: underline !important;
        }
        .ql-align-center {
          text-align: center !important;
        }
        .ql-align-right {
          text-align: right !important;
        }
        .ql-align-left {
          text-align: left !important;
        }
        /* Default left alignment for elements without alignment class */
        p:not([class*="ql-align"]):not([style*="text-align"]),
        li:not([class*="ql-align"]):not([style*="text-align"]) {
          text-align: left !important;
        }
        .ql-align-justify {
          text-align: justify !important;
        }
        /* List formatting */
        ul, ol {
          margin: 0;
          padding-left: 20px;
          list-style-type: disc !important;
        }
        li {
          margin-bottom: 8px;
          list-style-type: disc !important;
          display: list-item !important;
        }
      </style>
      <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #0F1C2A;">`;

    for (const sectionName of cvData.sections) {
      const sectionContent = mergedContent[sectionName];
      
      if (!sectionContent) continue;

      html += `<h2 style="color: #2782EA; border-bottom: 2px solid #2782EA; padding-bottom: 5px; margin-top: 30px; font-size: 18px; font-weight: bold;">${sectionName.toUpperCase()}</h2>`;

      if (sectionName === 'Personal Information' && typeof sectionContent === 'object' && !Array.isArray(sectionContent)) {
        const info = sectionContent as Record<string, string>;
        html += '<div style="margin-bottom: 20px;">';
        if (info.name) {
          html += `<p style="font-size: 24px; font-weight: bold; margin: 0; color: #0F1C2A;">${info.name.toUpperCase()}</p>`;
        }
        html += '<p style="margin: 10px 0; color: #666;">';
        const details: string[] = [];
        if (info.email) details.push(info.email);
        if (info.phone) details.push(info.phone);
        if (info.linkedin) details.push(info.linkedin);
        if (info.github) details.push(info.github);
        html += details.join(' | ');
        html += '</p></div>';
      } else {
        const bullets = Array.isArray(sectionContent) ? sectionContent : [];
        if (bullets.length > 0) {
          let inList = false; // Track if we're currently inside a <ul>
          
          for (const bullet of bullets) {
            // Preserve HTML formatting from Quill
            let formattedBullet = bullet || '';
            
            // Check if Quill has already applied list formatting (<ul><li>...</li></ul>)
            const hasListFormatting = /<ul[^>]*>|<li[^>]*>/i.test(formattedBullet);
            
            if (hasListFormatting) {
              // Quill has list formatting - render as bulleted list item
              // Start a <ul> if we're not already in one
              if (!inList) {
                html += '<ul style="margin-left: 20px; padding-left: 20px; list-style-type: disc;">';
                inList = true;
              }
              
              // Quill has already wrapped it in <ul><li>, so extract just the <li> content
              // Handle nested <ul><li> structure from Quill
              let listContent = formattedBullet;
              
              // Remove outer <ul> tags if present
              listContent = listContent.replace(/^<ul[^>]*>/i, '').replace(/<\/ul>$/i, '');
              
              // Extract alignment from the <li> tag if present
              let align = 'left'; // Default to left
              const liAlignMatch = formattedBullet.match(/<li[^>]*class="[^"]*ql-align-(\w+)/);
              const liStyleMatch = formattedBullet.match(/<li[^>]*style="[^"]*text-align:\s*(\w+)/);
              
              if (liAlignMatch) {
                align = liAlignMatch[1];
              } else if (liStyleMatch) {
                align = liStyleMatch[1];
              }
              
              // Extract inner content from <li> tags, but preserve nested formatting
              // Match the first <li> tag and extract its content
              const liMatch = listContent.match(/<li[^>]*>(.*?)<\/li>/is);
              if (liMatch && liMatch[1]) {
                listContent = liMatch[1];
              } else {
                // Fallback: remove all <li> tags
                listContent = listContent.replace(/<li[^>]*>/gi, '').replace(/<\/li>/gi, '');
              }
              
              const alignStyle = `text-align: ${align};`;
              html += `<li style="margin-bottom: 8px; color: #0F1C2A; list-style-type: disc; display: list-item; ${alignStyle}">${listContent}</li>`;
            } else {
              // Regular paragraph formatting (no list from Quill) - render as paragraph
              // Close any open <ul> if we were in a list
              if (inList) {
                html += '</ul>';
                inList = false;
              }
              
              // If it's plain text (no HTML), wrap it
              if (!/<[a-z][\s\S]*>/i.test(formattedBullet)) {
                formattedBullet = `<p>${formattedBullet}</p>`;
              }
              
              // Extract alignment from Quill's paragraph classes or inline styles
              let align = 'left'; // Default to left
              const alignClassMatch = formattedBullet.match(/class="[^"]*ql-align-(\w+)/);
              const alignStyleMatch = formattedBullet.match(/style="[^"]*text-align:\s*(\w+)/);
              
              if (alignClassMatch) {
                align = alignClassMatch[1];
              } else if (alignStyleMatch) {
                align = alignStyleMatch[1];
              }
              // If no alignment found, default to 'left' (already set above)
              
              // Extract the inner content (remove outer <p> tags but keep all formatting)
              let innerContent = formattedBullet
                .replace(/^<p[^>]*>/, '')
                .replace(/<\/p>$/, '');
              
              // If no content after removing <p>, use the original
              if (!innerContent.trim()) {
                innerContent = formattedBullet;
              }
              
              // Apply alignment style and render as paragraph
              const alignStyle = `text-align: ${align};`;
              html += `<p style="margin-bottom: 8px; color: #0F1C2A; ${alignStyle}">${innerContent}</p>`;
            }
          }
          
          // Close any open <ul> at the end
          if (inList) {
            html += '</ul>';
          }
        }
      }
    }

    html += '</div>';

    if (previewRef.current) {
      previewRef.current.innerHTML = html;
    }
  }, [cvData, updatedContent]);

  if (!cvData) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm h-full flex items-center justify-center">
        <p className="text-gray-500">Upload a CV to see preview</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm h-full overflow-y-auto">
      <div
        ref={previewRef}
        className="p-8"
        style={{ fontFamily: 'Lato, Arial, sans-serif' }}
      />
    </div>
  );
}


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
    let html = '<div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; color: #0F1C2A;">';

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
          html += '<ul style="margin-left: 20px; padding-left: 0;">';
          for (const bullet of bullets) {
            // Preserve basic formatting but sanitize
            let formattedBullet = bullet;
            // Convert common HTML to plain text with formatting hints
            formattedBullet = formattedBullet.replace(/<strong>(.*?)<\/strong>/gi, '<strong>$1</strong>');
            formattedBullet = formattedBullet.replace(/<b>(.*?)<\/b>/gi, '<strong>$1</strong>');
            formattedBullet = formattedBullet.replace(/<em>(.*?)<\/em>/gi, '<em>$1</em>');
            formattedBullet = formattedBullet.replace(/<i>(.*?)<\/i>/gi, '<em>$1</em>');
            formattedBullet = formattedBullet.replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>');
            // Remove other HTML tags
            formattedBullet = formattedBullet.replace(/<[^>]*>/g, '');
            html += `<li style="margin-bottom: 8px; color: #0F1C2A;">${formattedBullet}</li>`;
          }
          html += '</ul>';
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


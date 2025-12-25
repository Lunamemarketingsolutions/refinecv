import jsPDF from 'jspdf';

export interface CVContent {
  sections: string[];
  content: Record<string, string[] | Record<string, string>>;
}

// Helper to parse HTML and extract text with formatting info
interface FormattedText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

// Helper to extract plain text from HTML (preserving structure info)
function extractTextFromHTML(html: string): { text: string; isList: boolean; align: string; formattedParts: FormattedText[] } {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Check if it's a list
  const hasListFormatting = /<ul[^>]*>|<li[^>]*>/i.test(html);
  
  // Extract alignment
  let align = 'left';
  const alignClassMatch = html.match(/class="[^"]*ql-align-(\w+)/);
  const alignStyleMatch = html.match(/style="[^"]*text-align:\s*(\w+)/);
  if (alignClassMatch) {
    align = alignClassMatch[1];
  } else if (alignStyleMatch) {
    align = alignStyleMatch[1];
  }
  
  // Extract formatted text parts by walking the DOM tree
  const formattedParts: FormattedText[] = [];
  
  const walkNode = (node: Node, currentFormat: { bold?: boolean; italic?: boolean; underline?: boolean } = {}) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text.trim()) {
        formattedParts.push({
          text: text.trim(),
          ...currentFormat
        });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();
      
      // Update current format based on tag
      const newFormat = { ...currentFormat };
      if (tagName === 'strong' || tagName === 'b') {
        newFormat.bold = true;
      } else if (tagName === 'em' || tagName === 'i') {
        newFormat.italic = true;
      } else if (tagName === 'u') {
        newFormat.underline = true;
      }
      
      // Recursively process child nodes with updated format
      Array.from(element.childNodes).forEach(child => walkNode(child, newFormat));
    }
  };
  
  // Remove list tags before parsing (we'll handle list separately)
  const contentWithoutList = html
    .replace(/^<ul[^>]*>/i, '')
    .replace(/<\/ul>$/i, '')
    .replace(/<li[^>]*>/gi, '')
    .replace(/<\/li>/gi, '');
  
  const parseDiv = document.createElement('div');
  parseDiv.innerHTML = contentWithoutList;
  Array.from(parseDiv.childNodes).forEach(node => walkNode(node));
  
  // If no formatted parts found, get plain text
  const plainText = tempDiv.textContent || tempDiv.innerText || '';
  
  return {
    text: plainText.trim(),
    isList: hasListFormatting,
    align,
    formattedParts: formattedParts.length > 0 ? formattedParts : [{ text: plainText.trim() }]
  };
}

export async function generatePDFFromCV(
  cvContent: CVContent,
  filename: string = `Refined_CV_${new Date().toISOString().split('T')[0]}.pdf`
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper to add new page if needed
  const checkPageBreak = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Add title/header
  doc.setFontSize(18);
  doc.setTextColor(39, 130, 234); // #2782EA
  doc.setFont('helvetica', 'bold');
  
  // Extract name from Personal Information
  let name = 'Your Name';
  if (cvContent.content['Personal Information']) {
    const personalInfo = cvContent.content['Personal Information'] as Record<string, string>;
    if (personalInfo.name) {
      name = personalInfo.name.toUpperCase();
    }
  }
  
  doc.text(name, margin, yPosition);
  yPosition += 10;

  // Add contact info
  doc.setFontSize(10);
  doc.setTextColor(15, 28, 42); // #0F1C2A
  doc.setFont('helvetica', 'normal');
  
  if (cvContent.content['Personal Information']) {
    const personalInfo = cvContent.content['Personal Information'] as Record<string, string>;
    const contactDetails: string[] = [];
    if (personalInfo.email) contactDetails.push(personalInfo.email);
    if (personalInfo.phone) contactDetails.push(personalInfo.phone);
    if (personalInfo.linkedin) contactDetails.push(personalInfo.linkedin);
    if (personalInfo.github) contactDetails.push(personalInfo.github);
    
    if (contactDetails.length > 0) {
      doc.text(contactDetails.join(' | '), margin, yPosition);
      yPosition += 8;
    }
  }

  yPosition += 5;

  // Add sections
  for (const sectionName of cvContent.sections) {
    if (sectionName === 'Personal Information') continue; // Already handled
    
    checkPageBreak(15);
    
    // Section header
    doc.setFontSize(14);
    doc.setTextColor(39, 130, 234); // #2782EA
    doc.setFont('helvetica', 'bold');
    doc.text(sectionName.toUpperCase(), margin, yPosition);
    
    // Draw line under header
    doc.setDrawColor(39, 130, 234);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
    
    yPosition += 8;
    
    // Section content
    doc.setFontSize(10);
    doc.setTextColor(15, 28, 42); // #0F1C2A
    doc.setFont('helvetica', 'normal');
    
    const sectionContent = cvContent.content[sectionName];
    if (Array.isArray(sectionContent)) {
      for (const bullet of sectionContent) {
        checkPageBreak(8);
        
        // Parse HTML to extract formatting and structure
        const parsed = extractTextFromHTML(bullet);
        
        // Determine if we should show a bullet (only if list formatting is present)
        const prefix = parsed.isList ? '• ' : '';
        const baseStartX = parsed.isList ? margin + 5 : margin;
        const availableWidth = maxWidth - (baseStartX - margin);
        
        // Build the full text with prefix
        const fullText = prefix + parsed.text;
        
        // Split text into lines that fit the width
        const lines = doc.splitTextToSize(fullText, availableWidth);
        
        // Calculate alignment for the first line
        let firstLineOffset = 0;
        if (parsed.align === 'center' && lines.length > 0) {
          const firstLineWidth = doc.getTextWidth(lines[0]);
          firstLineOffset = (availableWidth - firstLineWidth) / 2;
        } else if (parsed.align === 'right' && lines.length > 0) {
          const firstLineWidth = doc.getTextWidth(lines[0]);
          firstLineOffset = availableWidth - firstLineWidth;
        }
        
        // Check if text has bold, italic, or underline
        const hasBold = parsed.formattedParts.some(p => p.bold);
        const hasItalic = parsed.formattedParts.some(p => p.italic);
        const hasUnderline = parsed.formattedParts.some(p => p.underline);
        
        // Determine font style
        let fontStyle: 'normal' | 'bold' | 'italic' | 'bolditalic' = 'normal';
        if (hasBold && hasItalic) {
          fontStyle = 'bolditalic';
        } else if (hasBold) {
          fontStyle = 'bold';
        } else if (hasItalic) {
          fontStyle = 'italic';
        }
        
        doc.setFont('helvetica', fontStyle);
        
        // Render each line with proper alignment
        const lineHeight = 5;
        let currentY = yPosition;
        
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
          const line = lines[lineIndex];
          // First line uses alignment offset, subsequent lines align based on alignment type
          let lineStartX = baseStartX;
          if (lineIndex === 0) {
            lineStartX = baseStartX + firstLineOffset;
          } else if (parsed.align === 'center') {
            const lineWidth = doc.getTextWidth(line);
            lineStartX = baseStartX + (availableWidth - lineWidth) / 2;
          } else if (parsed.align === 'right') {
            const lineWidth = doc.getTextWidth(line);
            lineStartX = baseStartX + (availableWidth - lineWidth);
          }
          
          // Render the line
          doc.text(line, lineStartX, currentY);
          
          // Draw underline if needed
          if (hasUnderline) {
            const textWidth = doc.getTextWidth(line);
            doc.setDrawColor(15, 28, 42);
            doc.setLineWidth(0.1);
            doc.line(lineStartX, currentY + 1, lineStartX + textWidth, currentY + 1);
          }
          
          currentY += lineHeight;
        }
        
        yPosition = currentY + 2;
      }
    } else if (typeof sectionContent === 'object') {
      // Handle structured content
      for (const [key, value] of Object.entries(sectionContent)) {
        checkPageBreak(6);
        doc.text(`${key}: ${value}`, margin + 5, yPosition);
        yPosition += 6;
      }
    }
    
    yPosition += 5; // Space between sections
  }

  // Save PDF
  doc.save(filename);
}


import jsPDF from 'jspdf';

export interface CVContent {
  sections: string[];
  content: Record<string, string[] | Record<string, string>>;
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
        
        // Split long bullets into multiple lines
        const lines = doc.splitTextToSize(`• ${bullet}`, maxWidth - 10);
        doc.text(lines, margin + 5, yPosition);
        yPosition += lines.length * 5 + 2;
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


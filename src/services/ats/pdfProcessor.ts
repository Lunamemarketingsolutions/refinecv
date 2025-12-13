import * as pdfjsLib from 'pdfjs-dist';
import type { ATSAnalysis, ATSIssue, ResumeSection } from '../../types/ats';
import { calculateDetailedScore } from './atsScoring';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface TextItem {
  str: string;
  transform: number[];
  width: number;
  height: number;
  fontName?: string;
}

interface ExtractedTextWithMetadata {
  fullText: string;
  lines: Array<{
    text: string;
    lineNumber: number;
    fontSize: number;
    isAllCaps: boolean;
    wordCount: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    pageNumber?: number;
  }>;
}

export async function extractTextFromPDF(file: File): Promise<string> {
  const result = await extractTextWithMetadata(file);
  return result.fullText;
}

async function extractTextWithMetadata(file: File): Promise<ExtractedTextWithMetadata> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';
  const lines: ExtractedTextWithMetadata['lines'] = [];
  let lineNumber = 0;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1.0 });

    let currentLine = '';
    let currentFontSize = 0;
    let itemsInLine: TextItem[] = [];
    let lineMinX = Infinity;
    let lineMinY = Infinity;
    let lineMaxX = -Infinity;
    let lineMaxY = -Infinity;

    textContent.items.forEach((item: any, index: number) => {
      const textItem = item as TextItem;
      const fontSize = textItem.transform ? textItem.transform[0] : 12;
      const x = textItem.transform ? textItem.transform[4] : 0;
      const y = textItem.transform ? textItem.transform[5] : 0;

      if (textItem.str.trim()) {
        currentLine += textItem.str;
        currentFontSize = Math.max(currentFontSize, fontSize);
        itemsInLine.push(textItem);

        lineMinX = Math.min(lineMinX, x);
        lineMinY = Math.min(lineMinY, y);
        lineMaxX = Math.max(lineMaxX, x + textItem.width);
        lineMaxY = Math.max(lineMaxY, y + textItem.height);
      }

      const nextItem = textContent.items[index + 1] as TextItem | undefined;
      const isLineBreak = !nextItem || textItem.str.includes('\n') ||
                          (nextItem.transform && Math.abs(nextItem.transform[5] - textItem.transform[5]) > 5);

      if (isLineBreak && currentLine.trim()) {
        const trimmedLine = currentLine.trim();
        fullText += trimmedLine + '\n';

        lines.push({
          text: trimmedLine,
          lineNumber: lineNumber++,
          fontSize: currentFontSize,
          isAllCaps: trimmedLine === trimmedLine.toUpperCase() && /[A-Z]/.test(trimmedLine),
          wordCount: trimmedLine.split(/\s+/).length,
          x: lineMinX,
          y: viewport.height - lineMaxY,
          width: lineMaxX - lineMinX,
          height: lineMaxY - lineMinY,
          pageNumber: i - 1
        });

        currentLine = '';
        currentFontSize = 0;
        itemsInLine = [];
        lineMinX = Infinity;
        lineMinY = Infinity;
        lineMaxX = -Infinity;
        lineMaxY = -Infinity;
      }
    });

    fullText += '\n';
  }

  return { fullText, lines };
}

export async function analyzePDFForATS(file: File): Promise<ATSAnalysis> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageCount = pdf.numPages;

  const extracted = await extractTextWithMetadata(file);
  const text = extracted.fullText;

  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const characterCount = text.length;

  const detailedAnalysis = calculateDetailedScore(text, wordCount, pageCount);

  const detectedSections = detectAllSections(extracted);

  return {
    score: detailedAnalysis.overallScore,
    issues: detailedAnalysis.prioritizedIssues,
    recommendations: detailedAnalysis.recommendations,
    extractedText: text,
    sections: {},
    detectedSections,
    stats: {
      wordCount,
      characterCount,
      pageCount
    },
    detailedScore: detailedAnalysis
  };
}

function detectTablePattern(content: string): boolean {
  const tableIndicators = [
    /\|[\s\S]*?\|/,
    /\t{2,}/,
    /^[\s]*[\w\s]+[\s]{3,}[\w\s]+[\s]{3,}[\w\s]+/m,
  ];
  return tableIndicators.some(pattern => pattern.test(content));
}

function detectAllSections(extracted: ExtractedTextWithMetadata): ResumeSection[] {
  const { lines, fullText } = extracted;
  const sections: ResumeSection[] = [];

  const avgFontSize = lines.reduce((sum, line) => sum + line.fontSize, 0) / lines.length;
  const potentialHeaders: Array<{
    lineNumber: number;
    text: string;
    confidence: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    pageNumber?: number;
    fontSize: number;
  }> = [];

  lines.forEach((line, index) => {
    if (line.text.length === 0 || line.text.length > 50) return;

    let confidence = 0;

    if (line.fontSize > avgFontSize * 1.1) confidence += 3;
    if (line.isAllCaps) confidence += 2;
    if (line.wordCount >= 1 && line.wordCount <= 4) confidence += 2;
    if (/^[A-Z][A-Z\s&-]+$/.test(line.text)) confidence += 1;
    if (line.text.endsWith(':')) confidence += 1;
    if (/^(experience|education|skills|summary|objective|projects|certifications|awards|publications|languages|volunteer|activities|interests|references|profile|about|contact|technical|professional|work|employment|qualifications|training|licenses|competencies|achievements|honors)/i.test(line.text)) {
      confidence += 3;
    }

    const prevLine = index > 0 ? lines[index - 1] : null;
    const nextLine = index < lines.length - 1 ? lines[index + 1] : null;

    if (prevLine && prevLine.text.trim() === '') confidence += 1;
    if (nextLine && nextLine.text.length > 20) confidence += 1;

    if (confidence >= 4) {
      potentialHeaders.push({
        lineNumber: line.lineNumber,
        text: line.text.replace(/:$/, '').trim(),
        confidence,
        x: line.x,
        y: line.y,
        width: line.width,
        height: line.height,
        pageNumber: line.pageNumber,
        fontSize: line.fontSize
      });
    }
  });

  potentialHeaders.sort((a, b) => a.lineNumber - b.lineNumber);

  const textLines = fullText.split('\n');

  for (let i = 0; i < potentialHeaders.length; i++) {
    const header = potentialHeaders[i];
    const nextHeader = potentialHeaders[i + 1];

    const startLine = header.lineNumber + 1;
    const endLine = nextHeader ? nextHeader.lineNumber : textLines.length;

    const content = textLines.slice(startLine, endLine)
      .join('\n')
      .trim();

    const wasExtracted = content.length > 0;
    let issueReason: string | undefined;
    const hasTable = detectTablePattern(content);
    const hasImage = !wasExtracted && (endLine - startLine > 5);

    if (!wasExtracted) {
      if (nextHeader && nextHeader.lineNumber - header.lineNumber <= 2) {
        issueReason = 'No content found between this header and the next section';
      } else {
        issueReason = 'ATS could not extract content for this section due to formatting issues';
      }
    } else if (hasTable) {
      issueReason = 'Section contains table formatting which may not be ATS-friendly';
    }

    const sectionContentLines = lines.filter(
      line => line.lineNumber >= startLine && line.lineNumber < endLine
    );

    let sectionHeight = 0;
    let sectionWidth = header.width || 400;

    if (sectionContentLines.length > 0) {
      const maxY = Math.max(...sectionContentLines.map(l => (l.y || 0) + (l.height || 0)));
      const minY = Math.min(...sectionContentLines.map(l => l.y || 0));
      sectionHeight = maxY - minY + (header.height || 20);
    } else {
      sectionHeight = 100;
    }

    sections.push({
      headerText: header.text,
      normalizedKey: header.text.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      wasExtracted,
      extractedContent: wasExtracted ? content : undefined,
      lineNumber: header.lineNumber,
      issueReason,
      hasTable,
      hasImage,
      coordinates: header.x !== undefined && header.y !== undefined && header.pageNumber !== undefined ? {
        x: header.x,
        y: header.y,
        width: sectionWidth,
        height: sectionHeight,
        pageNumber: header.pageNumber
      } : undefined,
      style: {
        fontSize: header.fontSize,
        fontFamily: 'Helvetica',
      }
    });
  }

  if (sections.length === 0) {
    const trimmedText = fullText.trim();
    const hasMinimalText = trimmedText.length < 50;
    const wordCount = trimmedText.split(/\s+/).filter(w => w.length > 0).length;
    const hasVeryFewWords = wordCount < 20;

    const isImageBased = hasMinimalText || hasVeryFewWords;

    const fallbackHeader: ResumeSection = {
      headerText: 'Resume Content',
      normalizedKey: 'resume_content',
      wasExtracted: !isImageBased,
      extractedContent: isImageBased ? undefined : trimmedText,
      lineNumber: 0,
      issueReason: isImageBased
        ? 'This resume appears to be image-based or heavily formatted. ATS systems cannot read images or complex layouts.'
        : undefined,
      hasImage: isImageBased,
      hasTable: false,
      coordinates: {
        x: 50,
        y: 50,
        width: 500,
        height: 700,
        pageNumber: 0
      },
      style: {
        fontSize: 12,
        fontFamily: 'Helvetica'
      }
    };
    sections.push(fallbackHeader);
  }

  return sections;
}

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { ATSSuggestion, SectionCoordinates } from '../../types/ats';

export async function loadPDFFromURL(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

export async function loadPDFFromFile(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

export async function applyTextReplacement(
  pdfBytes: Uint8Array,
  suggestion: ATSSuggestion
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes);

  if (!suggestion.coordinates) {
    console.warn('No coordinates provided for suggestion, returning original PDF');
    return pdfBytes;
  }

  const coordinates = suggestion.coordinates;
  const pages = pdfDoc.getPages();

  if (coordinates.pageNumber < 0 || coordinates.pageNumber >= pages.length) {
    console.warn('Invalid page number in coordinates');
    return pdfBytes;
  }

  const page = pages[coordinates.pageNumber];
  const { height: pageHeight } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 10;
  const lineHeight = fontSize * 1.2;

  page.drawRectangle({
    x: coordinates.x,
    y: pageHeight - coordinates.y - coordinates.height,
    width: coordinates.width,
    height: coordinates.height,
    color: rgb(1, 1, 1),
  });

  const lines = suggestion.suggestedContent.split('\n');
  let yPosition = pageHeight - coordinates.y - fontSize - 2;

  for (const line of lines) {
    if (yPosition < 50) break;

    const trimmedLine = line.trim();
    if (trimmedLine.length === 0) {
      yPosition -= lineHeight / 2;
      continue;
    }

    const maxWidth = coordinates.width - 20;
    const words = trimmedLine.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (textWidth > maxWidth && currentLine) {
        page.drawText(currentLine, {
          x: coordinates.x + 10,
          y: yPosition,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0),
        });
        yPosition -= lineHeight;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      page.drawText(currentLine, {
        x: coordinates.x + 10,
        y: yPosition,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      yPosition -= lineHeight;
    }
  }

  const modifiedPdfBytes = await pdfDoc.save();
  return modifiedPdfBytes;
}

export async function applyMultipleReplacements(
  pdfBytes: Uint8Array,
  suggestions: ATSSuggestion[]
): Promise<Uint8Array> {
  let currentPdfBytes = pdfBytes;

  const sortedSuggestions = [...suggestions].sort((a, b) => {
    if (!a.coordinates || !b.coordinates) return 0;
    if (a.coordinates.pageNumber !== b.coordinates.pageNumber) {
      return a.coordinates.pageNumber - b.coordinates.pageNumber;
    }
    return b.coordinates.y - a.coordinates.y;
  });

  for (const suggestion of sortedSuggestions) {
    try {
      currentPdfBytes = await applyTextReplacement(currentPdfBytes, suggestion);
    } catch (error) {
      console.error('Error applying suggestion:', error);
    }
  }

  return currentPdfBytes;
}

export function createPDFBlob(pdfBytes: Uint8Array): Blob {
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export function createPDFFile(pdfBytes: Uint8Array, filename: string): File {
  const blob = createPDFBlob(pdfBytes);
  return new File([blob], filename, { type: 'application/pdf' });
}

export async function generateEditedPDFFromURL(
  pdfUrl: string,
  suggestions: ATSSuggestion[]
): Promise<Uint8Array> {
  const pdfBytes = await loadPDFFromURL(pdfUrl);
  return await applyMultipleReplacements(pdfBytes, suggestions);
}

export async function generateEditedPDFFromFile(
  file: File,
  suggestions: ATSSuggestion[]
): Promise<Uint8Array> {
  const pdfBytes = await loadPDFFromFile(file);
  return await applyMultipleReplacements(pdfBytes, suggestions);
}

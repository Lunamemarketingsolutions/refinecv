import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Group text items by their Y position (line) to preserve line breaks
      // Also track X positions to determine spacing between words
      const lines: Map<number, Array<{ text: string; x: number; width: number }>> = new Map();
      
      textContent.items.forEach((item: any) => {
        if (!item.str || !item.str.trim()) return;
        
        // Get Y position (rounded to nearest 0.5 to group items on same line)
        const y = item.transform ? Math.round(item.transform[5] * 2) / 2 : 0;
        // Get X position and width for spacing calculation
        const x = item.transform ? item.transform[4] : 0;
        const width = item.width || 0;
        
        if (!lines.has(y)) {
          lines.set(y, []);
        }
        lines.get(y)!.push({ text: item.str, x, width });
      });
      
      // Sort lines by Y position (top to bottom, so reverse order)
      const sortedLines = Array.from(lines.entries())
        .sort((a, b) => b[0] - a[0]) // Higher Y = higher on page
        .map(([_, items]) => {
          // Sort items by X position (left to right)
          const sortedItems = items.sort((a, b) => a.x - b.x);
          
          // Join items with spaces, but be smart about spacing
          let lineText = '';
          for (let i = 0; i < sortedItems.length; i++) {
            const current = sortedItems[i];
            const next = sortedItems[i + 1];
            
            lineText += current.text;
            
            // Add space if there's a gap between current and next item
            // Check if next item is significantly to the right (more than 1.2x the width suggests a space)
            if (next) {
              const gap = next.x - (current.x + current.width);
              // If gap is larger than 20% of current width, add a space
              // This handles cases where PDF doesn't include explicit space characters
              if (gap > current.width * 0.2) {
                lineText += ' ';
              } else if (gap > 0) {
                // Small gap, still add space (words are usually separated)
                lineText += ' ';
              }
              // If gap is 0 or negative, items overlap or are adjacent (no space needed)
            }
          }
          
          return lineText.trim();
        })
        .filter(line => line.length > 0);
      
      // Join lines with newlines to preserve structure
      const pageText = sortedLines.join('\n');
      fullText += pageText + '\n\n'; // Double newline between pages
    }

    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF. Please ensure the file is a valid PDF.');
  }
}

export function validatePDFFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'File must be a PDF' };
  }

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  return { valid: true };
}

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ATSTemplateConfig, getContentWidth } from './templateConfig';
import type { ExtractedResumeData } from '../../types/ats';

interface TextLine {
  text: string;
  x: number;
  y: number;
  size: number;
  bold?: boolean;
  italic?: boolean;
}

export class PDFGenerator {
  private config = ATSTemplateConfig;
  private currentY: number;
  private currentPage: number = 0;
  private textLines: TextLine[] = [];
  private contentWidth: number;

  constructor() {
    this.currentY = this.config.page.height - this.config.page.marginTop;
    this.contentWidth = getContentWidth(this.config);
  }

  private needsNewPage(additionalHeight: number): boolean {
    return this.currentY - additionalHeight < this.config.page.marginBottom;
  }

  private addLine(text: string, size: number, bold = false, italic = false, indent = 0) {
    const x = this.config.page.marginLeft + indent;
    this.textLines.push({
      text,
      x,
      y: this.currentY,
      size,
      bold,
      italic,
    });
    this.currentY -= size * 1.2;
  }

  private addSpace(space: number) {
    this.currentY -= space;
  }

  private wrapText(text: string, maxWidth: number, fontSize: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    const avgCharWidth = fontSize * 0.5;

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const lineWidth = testLine.length * avgCharWidth;

      if (lineWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  private formatDate(startDate: string, endDate: string): string {
    if (endDate.toLowerCase() === 'present') {
      return `${startDate} to present`;
    }
    return `${startDate} to ${endDate}`;
  }

  async generateResumePDF(data: ExtractedResumeData): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([this.config.page.width, this.config.page.height]);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    this.currentY = this.config.page.height - this.config.page.marginTop;
    this.textLines = [];

    const nameY = this.currentY;
    this.addLine(
      data.contact.name.toUpperCase(),
      this.config.fonts.name.size,
      true
    );
    this.addSpace(this.config.spacing.afterName);

    const contactParts = [
      data.contact.location,
      data.contact.email,
      data.contact.phone,
    ];
    if (data.contact.linkedin) contactParts.push('LinkedIn');
    if (data.contact.github) contactParts.push('GitHub');

    this.addLine(
      contactParts.join(' | '),
      this.config.fonts.contact.size,
      false
    );
    this.addSpace(this.config.spacing.afterContact);

    if (data.education && data.education.length > 0) {
      this.addLine('EDUCATION', this.config.fonts.sectionHeader.size, true);
      this.addSpace(this.config.spacing.afterSectionHeader);

      for (const edu of data.education) {
        const eduLine = `${edu.institution}, ${edu.degree}${edu.field ? ', ' + edu.field : ''}${edu.gpa ? ', ' + edu.gpa + ' CGPA' : ''} ${edu.startDate}-${edu.endDate}`;

        const lines = this.wrapText(eduLine, this.contentWidth, this.config.fonts.body.size);
        for (let i = 0; i < lines.length; i++) {
          this.addLine(lines[i], this.config.fonts.body.size, i === 0);
        }

        this.addSpace(this.config.spacing.betweenEntries);
      }
      this.addSpace(this.config.spacing.betweenSections - this.config.spacing.betweenEntries);
    }

    if (data.skills && data.skills.categories && data.skills.categories.length > 0) {
      this.addLine('TECHNICAL KNOWLEDGE', this.config.fonts.sectionHeader.size, true);
      this.addSpace(this.config.spacing.afterSectionHeader);

      for (const category of data.skills.categories) {
        const skillLine = `${category.name}: ${category.skills.join(', ')}.`;
        const lines = this.wrapText(skillLine, this.contentWidth, this.config.fonts.body.size);
        for (const line of lines) {
          this.addLine(line, this.config.fonts.body.size, false);
        }
        this.addSpace(this.config.spacing.betweenBullets);
      }
      this.addSpace(this.config.spacing.betweenSections - this.config.spacing.betweenBullets);
    }

    if (data.experience && data.experience.length > 0) {
      this.addLine('INTERNSHIPS / WORK EXPERIENCE', this.config.fonts.sectionHeader.size, true);
      this.addSpace(this.config.spacing.afterSectionHeader);

      for (const exp of data.experience) {
        const titleLine = `${exp.company}, ${exp.title}, ${exp.location} ${this.formatDate(exp.startDate, exp.endDate)}`;
        const lines = this.wrapText(titleLine, this.contentWidth, this.config.fonts.subsectionTitle.size);
        for (const line of lines) {
          this.addLine(line, this.config.fonts.subsectionTitle.size, true);
        }

        if (exp.description) {
          const descLines = this.wrapText(exp.description, this.contentWidth, this.config.fonts.body.size);
          for (const line of descLines) {
            this.addLine(line, this.config.fonts.body.size, false);
          }
        }

        for (const bullet of exp.bullets) {
          const bulletLines = this.wrapText(
            `- ${bullet}`,
            this.contentWidth - this.config.spacing.bulletIndent,
            this.config.fonts.body.size
          );
          for (let i = 0; i < bulletLines.length; i++) {
            this.addLine(
              bulletLines[i],
              this.config.fonts.body.size,
              false,
              false,
              i === 0 ? 0 : this.config.spacing.bulletIndent
            );
          }
          this.addSpace(this.config.spacing.betweenBullets);
        }

        this.addSpace(this.config.spacing.betweenEntries);
      }
      this.addSpace(this.config.spacing.betweenSections - this.config.spacing.betweenEntries);
    }

    if (data.projects && data.projects.length > 0) {
      this.addLine('PROJECTS', this.config.fonts.sectionHeader.size, true);
      this.addSpace(this.config.spacing.afterSectionHeader);

      for (const project of data.projects) {
        let projectTitle = project.title;
        if (project.link) {
          projectTitle += ` - ${project.link}`;
        }
        if (project.startDate && project.endDate) {
          projectTitle += ` ${this.formatDate(project.startDate, project.endDate)}`;
        }

        const lines = this.wrapText(projectTitle, this.contentWidth, this.config.fonts.subsectionTitle.size);
        for (const line of lines) {
          this.addLine(line, this.config.fonts.subsectionTitle.size, true);
        }

        if (project.description) {
          const descLines = this.wrapText(project.description, this.contentWidth, this.config.fonts.body.size);
          for (const line of descLines) {
            this.addLine(line, this.config.fonts.body.size, false);
          }
        }

        for (const bullet of project.bullets) {
          const bulletLines = this.wrapText(
            `- ${bullet}`,
            this.contentWidth - this.config.spacing.bulletIndent,
            this.config.fonts.body.size
          );
          for (let i = 0; i < bulletLines.length; i++) {
            this.addLine(
              bulletLines[i],
              this.config.fonts.body.size,
              false,
              false,
              i === 0 ? 0 : this.config.spacing.bulletIndent
            );
          }
          this.addSpace(this.config.spacing.betweenBullets);
        }

        this.addSpace(this.config.spacing.betweenEntries);
      }
      this.addSpace(this.config.spacing.betweenSections - this.config.spacing.betweenEntries);
    }

    if (data.positions && data.positions.length > 0) {
      this.addLine('POSITION OF RESPONSIBILITY', this.config.fonts.sectionHeader.size, true);
      this.addSpace(this.config.spacing.afterSectionHeader);

      for (const position of data.positions) {
        const posLine = `${position.title}${position.organization ? ', ' + position.organization : ''} ${position.date || ''}`;
        const lines = this.wrapText(posLine, this.contentWidth, this.config.fonts.body.size);
        for (const line of lines) {
          this.addLine(line, this.config.fonts.body.size, true);
        }
        if (position.description) {
          const descLines = this.wrapText(position.description, this.contentWidth, this.config.fonts.body.size);
          for (const line of descLines) {
            this.addLine(line, this.config.fonts.body.size, false);
          }
        }
        this.addSpace(this.config.spacing.betweenBullets);
      }
      this.addSpace(this.config.spacing.betweenSections - this.config.spacing.betweenBullets);
    }

    if (data.awards && data.awards.length > 0) {
      this.addLine('AWARDS AND RECOGNITIONS', this.config.fonts.sectionHeader.size, true);
      this.addSpace(this.config.spacing.afterSectionHeader);

      for (const award of data.awards) {
        const awardLine = `${award.title}${award.organization ? ' | ' + award.organization : ''} ${award.date || ''}`;
        const lines = this.wrapText(awardLine, this.contentWidth, this.config.fonts.body.size);
        for (const line of lines) {
          this.addLine(line, this.config.fonts.body.size, false);
        }
        this.addSpace(this.config.spacing.betweenBullets);
      }
    }

    let currentPageIndex = 0;
    for (const line of this.textLines) {
      if (line.y < this.config.page.marginBottom) {
        page = pdfDoc.addPage([this.config.page.width, this.config.page.height]);
        currentPageIndex++;

        const offset = this.config.page.height - this.config.page.marginTop - line.y;
        for (let i = this.textLines.indexOf(line); i < this.textLines.length; i++) {
          this.textLines[i].y += offset;
        }
      }

      const currentFont = line.bold ? fontBold : font;
      const pages = pdfDoc.getPages();
      const drawPage = pages[Math.min(currentPageIndex, pages.length - 1)];

      drawPage.drawText(line.text, {
        x: line.x,
        y: line.y,
        size: line.size,
        font: currentFont,
        color: rgb(0, 0, 0),
      });
    }

    const lineY = nameY - (this.config.fonts.name.size * 1.2) + (this.config.spacing.afterName / 2);
    pdfDoc.getPages()[0].drawLine({
      start: { x: this.config.page.marginLeft, y: lineY },
      end: { x: this.config.page.width - this.config.page.marginRight, y: lineY },
      thickness: 0.5,
      color: rgb(0, 0, 0),
    });

    return await pdfDoc.save();
  }
}


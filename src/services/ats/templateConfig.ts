export interface TemplateConfig {
  page: {
    width: number;
    height: number;
    marginTop: number;
    marginBottom: number;
    marginLeft: number;
    marginRight: number;
  };
  fonts: {
    name: {
      size: number;
      lineHeight: number;
    };
    sectionHeader: {
      size: number;
      lineHeight: number;
    };
    subsectionTitle: {
      size: number;
      lineHeight: number;
    };
    body: {
      size: number;
      lineHeight: number;
    };
    contact: {
      size: number;
      lineHeight: number;
    };
  };
  spacing: {
    afterName: number;
    afterContact: number;
    betweenSections: number;
    afterSectionHeader: number;
    betweenEntries: number;
    bulletIndent: number;
    betweenBullets: number;
  };
  colors: {
    text: string;
    sectionUnderline: string;
  };
}

export const ATSTemplateConfig: TemplateConfig = {
  page: {
    width: 612,
    height: 792,
    marginTop: 50,
    marginBottom: 50,
    marginLeft: 50,
    marginRight: 50,
  },
  fonts: {
    name: {
      size: 20,
      lineHeight: 24,
    },
    sectionHeader: {
      size: 11,
      lineHeight: 14,
    },
    subsectionTitle: {
      size: 11,
      lineHeight: 13,
    },
    body: {
      size: 10,
      lineHeight: 12,
    },
    contact: {
      size: 9,
      lineHeight: 11,
    },
  },
  spacing: {
    afterName: 8,
    afterContact: 12,
    betweenSections: 14,
    afterSectionHeader: 6,
    betweenEntries: 8,
    bulletIndent: 15,
    betweenBullets: 4,
  },
  colors: {
    text: '#000000',
    sectionUnderline: '#000000',
  },
};

export function getContentWidth(config: TemplateConfig): number {
  return config.page.width - config.page.marginLeft - config.page.marginRight;
}

export function getContentHeight(config: TemplateConfig): number {
  return config.page.height - config.page.marginTop - config.page.marginBottom;
}


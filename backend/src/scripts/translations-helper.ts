/**
 * Helper function to create multi-language content objects
 * This ensures all language fields are present for consistency
 */

export function createMultiLang(
  en: string,
  hi: string,
  translations?: {
    gu?: string;
    ta?: string;
    te?: string;
    mr?: string;
    bn?: string;
    kn?: string;
    ml?: string;
    or?: string;
    pa?: string;
    as?: string;
    ur?: string;
  }
) {
  return {
    en,
    hi,
    gu: translations?.gu || en,
    ta: translations?.ta || en,
    te: translations?.te || en,
    mr: translations?.mr || hi,
    bn: translations?.bn || en,
    kn: translations?.kn || en,
    ml: translations?.ml || en,
    or: translations?.or || hi,
    pa: translations?.pa || hi,
    as: translations?.as || en,
    ur: translations?.ur || hi,
  };
}


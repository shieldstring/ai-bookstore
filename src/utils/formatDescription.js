/** Normalize line endings and trim outer whitespace while preserving paragraphs. */
export const normalizeDescription = (text) => {
  if (!text) return "";
  return String(text).replace(/\r\n/g, "\n").trim();
};

/** Truncate description for cards; prefers breaking at a word boundary. */
export const truncateDescription = (text, maxLength = 300) => {
  const normalized = normalizeDescription(text);
  if (normalized.length <= maxLength) return normalized;

  const truncated = normalized.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  const cut =
    lastSpace > maxLength * 0.6
      ? truncated.slice(0, lastSpace)
      : truncated;

  return `${cut.trimEnd()}…`;
};

/** Split description into paragraph blocks (blank-line separated). */
export const splitDescriptionParagraphs = (text) => {
  const normalized = normalizeDescription(text);
  if (!normalized) return [];

  return normalized
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

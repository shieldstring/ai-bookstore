const STANDARD_ISBN_REGEX = /^(?:\d{9}[\dXx]|\d{13})$/;

export const isValidIsbn = (value, format = "Paperback") => {
  if (!value) return true;

  const isbn = String(value).trim();
  if (isbn.startsWith("COURSE-") || isbn.startsWith("BOOK-")) return true;

  return STANDARD_ISBN_REGEX.test(isbn.replace(/[-\s]/g, ""));
};

export const normalizeProvidedIsbn = (value) => {
  if (!value) return null;
  const isbn = String(value).trim();
  if (!isbn) return null;
  if (isbn.startsWith("COURSE-") || isbn.startsWith("BOOK-")) return isbn;
  return isbn.replace(/[-\s]/g, "");
};

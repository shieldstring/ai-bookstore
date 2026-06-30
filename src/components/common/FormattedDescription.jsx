import {
  normalizeDescription,
  splitDescriptionParagraphs,
  truncateDescription,
} from "../../utils/formatDescription";

const FormattedDescription = ({
  text,
  className = "",
  paragraphClassName = "text-gray-600 mb-3 last:mb-0 whitespace-pre-line",
  maxLength,
}) => {
  const displayText = maxLength
    ? truncateDescription(text, maxLength)
    : normalizeDescription(text);

  if (!displayText) return null;

  const paragraphs = splitDescriptionParagraphs(displayText);

  if (paragraphs.length <= 1) {
    return (
      <div className={className}>
        <p className={paragraphClassName}>{displayText}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={paragraphClassName}>
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default FormattedDescription;

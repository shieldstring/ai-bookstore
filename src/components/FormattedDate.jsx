import { format, parseISO } from "date-fns";

const FormattedDate = ({ date }) => {
  const formatDate = (date) => {
    const parsedDate = parseISO(date);
    return format(parsedDate, "EEE dd MMMM yyyy ");
  };
  return <span>{formatDate(date)}</span>;
};

export default FormattedDate;

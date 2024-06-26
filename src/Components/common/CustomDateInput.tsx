import moment from "moment";
import { useEffect, useState } from "react";

interface CustomDateInputProps {
  value: string;
  onChange: (value: string) => void;
}

const CustomDateInput: React.FC<CustomDateInputProps> = ({
  value,
  onChange,
}) => {
  const [date, setDate] = useState("");

  useEffect(() => {
    if (value) {
      setDate(moment(value, "YYYY-MM-DD").format("DD/MM/YYYY"));
    }
    console.log(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setDate(value);
    if (moment(value, "DD/MM/YYYY", true).isValid()) {
      onChange(moment(value, "MM/DD/YYYY").format("DD/MM/YYYY"));
    }
    console.log(value);
  };

  return (
    <input
      type="text"
      value={date}
      onChange={handleChange}
      placeholder="DD/MM/YYYY"
      required
    />
  );
};

export default CustomDateInput;

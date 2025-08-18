// import "./Date.scss";

// const DateInput = (props) => {
//   return (
//     <input
//       type="date"
//       name={props.name}
//       value={props.value}
//       onChange={props.onChange}
//       onBlur={props.onBlur}
//       placeholder={props.placeholder}
//       required
//       className={`date-input ${props.className}`}
//     />
//   );
// };

// export default DateInput;

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Date.scss";

const DateInput = ({ value, onChange, className, ...rest }) => {
  const isValidDate = (val) => {
    const date = new Date(val);
    return !isNaN(date);
  };

  return (
    <DatePicker
      selected={isValidDate(value) ? new Date(value + "T00:00:00") : null}
      onChange={(date) => {
        const localDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0];
        onChange({ target: { value: localDate } });
      }}
      className={`date-input ${className}`}
      dateFormat="yyyy-MM-dd"
      placeholderText="Select date"
      {...rest}
    />
  );
};

export default DateInput;

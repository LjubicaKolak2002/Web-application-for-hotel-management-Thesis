import "./Datetime.scss";

const DatetimeInput = (props) => {
  return (
    <input
      type="datetime-local"
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      placeholder={props.placeholder}
      required
      className="date-time-input"
    />
  );
};

export default DatetimeInput;

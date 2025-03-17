import "./Datetime.css";

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
      className="input"
    />
  );
};

export default DatetimeInput;

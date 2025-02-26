import "./Select.css";

const Select = (props) => {
  return (
    <select
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      required
      className="select"
    >
      <option value="">{props.placeholder || "Select an option"}</option>
      {props.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;

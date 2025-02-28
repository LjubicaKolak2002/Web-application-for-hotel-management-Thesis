import "./Checkbox.css";

const Checkbox = (props) => {
  return (
    <div>
      {props.options.map((option) => (
        <label key={option.value} className="checkbox-label">
          <input
            type="checkbox"
            name={props.name}
            value={option.value}
            checked={props.value.includes(option.value)}
            onChange={props.onChange}
            className="checkbox-input"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default Checkbox;

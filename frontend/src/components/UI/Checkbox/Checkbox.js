import "./Checkbox.scss";

const Checkbox = (props) => {
  return (
    <div className={`checkbox-container ${props.className}`}>
      {props.options.map((option) => (
        <label key={option.value} className="checkbox-item">
          <input
            type="checkbox"
            name={props.name}
            value={option.value}
            checked={props.value.includes(option.value)}
            onChange={props.onChange}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default Checkbox;

/* const Checkbox = ({ options, name, value, onChange }) => {
  return (
    <div className="checkbox-container">
      {options.map((option) => (
        <div key={option} className="checkbox-item">
          <input
            type="checkbox"
            name={name}
            value={option}
            checked={value.includes(option)}
            onChange={onChange}
          />
          {option}
        </div>
      ))}
    </div>
  );
}; */

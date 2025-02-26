import "./Input.css";

const Input = (props) => {
  return (
    <input
      type="text"
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

export default Input;

import "./PasswordInput.css";

const PasswordInput = (props) => {
  return (
    <input
      type="password"
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      placeholder={props.placeholder}
      required
      className="password-input"
    />
  );
};

export default PasswordInput;

import "./PasswordInput.scss";

const PasswordInput = ({ iconClass, ...props }) => {
  return (
    <div className="password-input-wrapper">
      {iconClass && <i className={iconClass}></i>}
      <input
        type="password"
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        placeholder={props.placeholder}
        required
        className="password-input"
        {...props}
      />
    </div>
  );
};

export default PasswordInput;

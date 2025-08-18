import "./Input.scss";

const Input = ({ iconClass, ...props }) => {
  return (
    <div className="input-wrapper">
      {iconClass && <i className={`input-wrapper-icon ${iconClass}`}></i>}
      <input
        type="text"
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        placeholder={props.placeholder}
        required
        className="input"
        {...props}
      />
    </div>
  );
};

export default Input;

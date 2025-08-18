import "./Button.scss";

const Button = ({
  label,
  children,
  onClick,
  className = "",
  variant = "default",
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`button ${variant} ${className}`}
      disabled={disabled}
    >
      {children || label}
    </button>
  );
};

export default Button;

import "./SubmitBtn.scss";

const SubmitBtn = (props) => {
  return (
    <button
      type="submit"
      onClick={props.onClick}
      disabled={props.disabled}
      className={`submitButton ${props.className || ""}`}
    >
      {props.label}
    </button>
  );
};

export default SubmitBtn;

import "./SubmitBtn.css";

const SubmitBtn = (props) => {
  return (
    <button
      type="submit"
      onClick={props.onClick}
      disabled={props.disabled}
      className="submit-btn"
    >
      {props.label}
    </button>
  );
};

export default SubmitBtn;

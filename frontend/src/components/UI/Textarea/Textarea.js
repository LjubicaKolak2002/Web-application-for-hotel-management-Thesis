import "./Textarea.scss";

const Textarea = (props) => {
  return (
    <textarea
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      placeholder={props.placeholder}
      required={props.required}
      rows={props.rows || 4}
      className="textarea"
    />
  );
};

export default Textarea;

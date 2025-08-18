import React from "react";
import "./InputRange.scss";

const RangeInput = ({ label, min, max, value, onChange, step = 1 }) => {
  return (
    <div className="rangeInput">
      <label>
        {label} {value} (€)
      </label>
      <input
        type="range"
        id="rangeInput"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={onChange}
      />
    </div>
  );
};

export default RangeInput;

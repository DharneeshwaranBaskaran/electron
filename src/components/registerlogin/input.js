import React from "react";
import "./resetinput.css"

const Input = ({ type, placeholder, value, onChange, error, name, style }) => (
  <>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      style={style}
    />
     <div className="error-message">{error}</div>
  </>
);

export default Input;


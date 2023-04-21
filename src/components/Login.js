import React, { useState } from "react";
import "./LoginStyles.css";

const Login = () => {
  const [popupStyle, showPopup] = useState("hide");

  const popup = () => {
    showPopup("login-popup");
    setTimeout(() => showPopup("hide"), 3000);
  };
  return (
    <div className="cover">
      <h1>Login</h1>
      <input type="text" placeholder="email" />
      <input type="password" placeholder="password" />

      <div className="login-btn" onClick={popup}>
        Login
      </div>

      <div className={popupStyle}>
        <h3>Login failed</h3>
        <p>The information that you gave us is incorrect.</p>
      </div>
    </div>
  );
};

export default Login;

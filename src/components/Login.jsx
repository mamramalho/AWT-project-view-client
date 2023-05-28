import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LoginStyles.css";

export const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("ok")
  
    try {
      const response = await fetch("http://localhost:3001/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        console.log("Token:", token);
        localStorage.setItem("token", token);
      } else {
        const errorText = await response.text();
        console.log(response)
        throw new Error(errorText);
      }
    } catch (error) {
      console.log(error);
      console.error("Error:", error.message);
    }
  };
  
  
  
  

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="email@gmail.com"
            id="email"
            name="email"
          />
          <br />
          <label htmlFor="password">Password</label>
          <input
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="********"
            id="password"
            name="password"
          />
          <button className="submit-btn" type="submit">
            Log In
          </button>
          <div className="link-btn">
            Don't have an account? <Link to="/register"> Register here.</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

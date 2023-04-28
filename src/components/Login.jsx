import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LoginStyles.css"

export const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="container">
    <div className="form-container">
      <h2 className="title">Login</h2>
      <form className="form" onSubmit={handleSubmit}>
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
        <br/>
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
        <button className="submit-btn" type="submit">Log In</button>
        <div className="link-btn">Don't have an account? <Link to="/register" > Register here.</Link></div>
      </form>
      
    </div>
    </div>
  );
};

export default Login;
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LoginStyles.css"

export const Register = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      name,
      email,
      password
    };
  
    if (password !== repeatPassword) {
      alert("Passwords do not match");
      return;
    }
  
    /* const token = localStorage.getItem("token"); */
  
    try {
      const response = await fetch("http://localhost:3001/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          /* Authorization: `Bearer ${token}`, */
        },
        body: JSON.stringify(newUser),
      });
  
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  

  const handleRepeatPasswordChange = (e) => {
    setRepeatPassword(e.target.value);
    console.log("repeatPassword:", repeatPassword);
  };
  

  return (
    <div className="login-container">
    <div className="login-form-container">
      <h2 className="login-title">Register</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="label" htmlFor="name">Name</label>
        <input
        className="input"
          value={name}
          name="name"
          onChange={(e) => setName(e.target.value)}
          id="name"
          placeholder="Name"
        />
        <br/>
        <label className="label" htmlFor="email">Email</label>
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
        <label className="label" htmlFor="password">Password</label>
        <input
        className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="********"
          id="password"
          name="password"
        />
        <br/>
        <label className="label" htmlFor="repeat-password">Repeat Password</label>
        <input
        className="input"
        value={repeatPassword}
        onChange={handleRepeatPasswordChange}
        type="password"
        placeholder="********"
        id="repeat-password"
        name="repeat-password"
        />
        <button className="submit-btn" type="submit">Register</button>
        <div className="link-btn">Already have an account? <Link to="/login"> Sign in. </Link></div>
      </form>
    </div>
    </div>
  );
};

export default Register;
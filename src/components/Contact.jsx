import React, { useState } from "react";
import "./ContactStyles.css";

const Contact = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailBody = `Title: ${title} \n\nMessage: ${message}`;
    const emailClient = "mailto:your_email@example.com";
    window.location.href = `${emailClient}?subject=Contact%20Form&body=${emailBody}`;
  };

  return (
    <div className="containerC">
    <div className="form-contact">
      <h2 className="titleC">Contact Us</h2>
      <form className="formC" onSubmit={handleSubmit}>
        <label className="labelC" htmlFor="title">Title</label>
        <input
          className="inputC"
          value={title}
          name="title"
          onChange={(e) => setTitle(e.target.value)}
          id="title"
          placeholder="Title"
        />
        <br />
        <label className="labelC" htmlFor="message">Message</label>
        <textarea
          className="textareaC"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="message"
          name="message"
          placeholder="Type your message here..."
        />
        <br />
        <button className="submit-btnC" type="submit">
          Submit
        </button>
      </form>
    </div>
    </div>
  );
};

export default Contact;

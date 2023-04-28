import React from "react";
import "./FooterStyles.css";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div>
        {`© ${year} Copyright : Miguel Ramalho & João Moreira - `}
        <a href="https://github.com/mamramalho/AWT-project-view-client">
          <FaGithub />
          Github
        </a>
      </div>
    </footer>
  );
};

export default Footer;

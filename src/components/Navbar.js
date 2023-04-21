import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavbarStyles.css";
import { HiBars3BottomRight } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";

const Navbar = () => {
  const [Mobile, setMobile] = useState(false);

  return (
    <nav className="navbar">
      <h3 className="logo">VIEW</h3>

      <ul
        className={Mobile ? "nav-links-mobile" : "nav-links"}
        onClick={() => setMobile(false)}
      >
        <Link to="/calendar">
          <li>Calendar</li>
        </Link>
        <Link to="/events">
          <li>Events</li>
        </Link>
        <Link to="/contact">
          <li>Contact Us</li>
        </Link>
        <Link to="/login">
          <li>Login</li>
        </Link>
      </ul>
      <button className="mobile-menu-icon" onClick={() => setMobile(!Mobile)}>
        {Mobile ? <RxCross2 /> : <HiBars3BottomRight />}
      </button>
    </nav>
  );
};

export default Navbar;

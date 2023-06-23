import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavbarStyles.css";
import { HiBars3BottomRight } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [mobile, setMobile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/user/logout", null, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error logging out:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up the request:", error.message);
      }
    }
  };
  

  const isLoggedIn = true;

  return (
    <nav className="navbar">
      <Link to="/calendar" className="logo">
        VIEW
      </Link>

      <ul
        className={mobile ? "nav-links-mobile" : "nav-links"}
        onClick={() => setMobile(false)}
      >
        <Link to="/calendar">
          <li>Calendar</li>
        </Link>
        <Link to="/events">
          <li>Events</li>
        </Link>
        <Link to="/invites">
          <li>Invites</li>
        </Link>
        <Link to="/contact">
          <li>Contact Us</li>
        </Link>
        {isLoggedIn ? (
          <li onClick={handleLogout}>Logout</li>
        ) : (
          <Link to="/login">
            <li>Login</li>
          </Link>
        )}
      </ul>
      <button className="mobile-menu-icon" onClick={() => setMobile(!mobile)}>
        {mobile ? <RxCross2 /> : <HiBars3BottomRight />}
      </button>
    </nav>
  );
};

export default Navbar;

import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Events from "./components/Events";
import Calendar from "./components/Calendar";
import Login from "./components/Login";
import Footer from "./components/Footer";

class App extends Component {
  render() {
    return (
      <>
        <Router>
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/calendar" element={<Calendar />} />
            <Route exact path="/events" element={<Events />} />
            <Route exact path="/login" element={<Login />} />
          </Routes>
          <Footer />
        </Router>
      </>
    );
  }
}

export default App;

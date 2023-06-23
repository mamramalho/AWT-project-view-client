import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Events from "./components/Events";
import Invites from "./components/Invites";
import Calendar from "./components/Calendar";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";

class App extends Component {
  render() {
    return (
      <>
        <Router>
          <Navbar />
          <Routes>
            <Route exact path="/calendar" element={<Calendar />} />
            <Route path="/events" element={<Events />} />
            <Route exact path="/invites" element={<Invites />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
        </Router>
      </>
    );
  }
}

export default App;

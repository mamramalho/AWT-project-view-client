import React, { useEffect, useState } from "react";
import ReactCalendar from "react-calendar";
import axios from "axios";
import "./CalendarStyles.css";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [listOfEvents, setListOfEvents] = useState([]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    axios.get("http://localhost:3001/event").then((response) => {
      setListOfEvents(response.data);
    });
  }, []);

  return (
    <div className="container">
      <ReactCalendar
        minDate={new Date()}
        className="REACT-CALENDAR"
        view="month"
        onClickDay={handleDateClick}
      />
      {listOfEvents.map((value, index) => (
        <div className="selected-events" key={index}>
          <div className="selected-day">Events for {selectedDate && selectedDate.toDateString()}</div>
          <div className="selected-titleEvent">{value.title}</div>
          <div className="selected-descriptionEvent">{value.description}</div>
        </div>
      ))}
    </div>
  );
};

export default Calendar;

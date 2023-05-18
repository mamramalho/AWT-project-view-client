import React, { useState } from "react";
import ReactCalendar from "react-calendar";
import "./CalendarStyles.css";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    console.log("Events for date:", date);
  };

  return (
    <div className="container">
      <ReactCalendar
        minDate={new Date()}
        className="REACT-CALENDAR"
        view="month"
        onClickDay={handleDateClick}
      />
      {selectedDate && (
        <div className="selected-events">
          <h2>Events for {selectedDate.toDateString()}</h2>
          {/* Display the events for the selected date */}
          {/* You can use the selectedDate to filter the events */}
        </div>
      )}
    </div>
  );
};

export default Calendar;

import React from "react";
import ReactCalendar from "react-calendar";
import "./CalendarStyles.css";

const Calendar = () => {
  return (
    <div className="container">
      <ReactCalendar
        minDate={new Date()}
        className="REACT-CALENDAR"
        view="month"
        onClickDay={(date) => console.log(date)}
      />
    </div>
  );
};

export default Calendar;

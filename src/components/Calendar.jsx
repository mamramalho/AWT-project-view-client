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

  const eventsForSelectedDate = selectedDate
    ? listOfEvents.filter((event) => {
        const eventDate = new Date(event.date);
        const selectedDateUTC = new Date(
          Date.UTC(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate()
          )
        );
        return (
          eventDate.toISOString().slice(0, 10) ===
          selectedDateUTC.toISOString().slice(0, 10)
        );
      })
    : [];

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
          <div className="selected-day">
            Events for {selectedDate.toDateString()}
          </div>
          {eventsForSelectedDate.length > 0 ? (
            eventsForSelectedDate.map((event, index) => (
              <div className="event" key={index}>
                <div className="event-title">{event.title}</div>
                <div className="event-description">{event.description}</div>
              </div>
            ))
          ) : (
            <div className="no-events">No events for this date</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;

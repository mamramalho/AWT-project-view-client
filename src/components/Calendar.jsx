import React, { useState, useEffect } from "react";
import ReactCalendar from "react-calendar";
import axios from "axios";
import "./CalendarStyles.css";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [listOfEvents, setListOfEvents] = useState([]);

  const handleDateClick = async (date) => {
    try {
      const calendar = { name: "My Calendar" }; // Modify the name according to your requirements

      const response = await axios.post("http://localhost:3001/calendar", calendar);

      if (response.status === 201) {
        // Calendar created successfully
        // You can perform additional actions if needed
      }
    } catch (error) {
      console.error("Error creating calendar:", error);
      // Handle the error
    }

    setSelectedDate(date);
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventResponse = await axios.get("http://localhost:3001/event");
        setListOfEvents(eventResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error
      }
    };

    fetchEventData();
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

import React, { useState, useEffect } from "react";
import ReactCalendar from "react-calendar";
import axios from "axios";
import "./CalendarStyles.css";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [listOfEvents, setListOfEvents] = useState([]);
  const navigate = useNavigate();
  const [showCreateEventButton, setShowCreateEventButton] = useState(false);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowCreateEventButton(true);
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/user/events", {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        });
        setListOfEvents(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
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

    const handleCreateEvent = () => {
      navigate("/events", {
        state: {
          selectedDate: selectedDate,
          showCreateForm: true,
        },
      });
    };
    
    const handleInvite = () => {
      navigate("/events", {
        state: {
          selectedDate: selectedDate,
        },
      });
    };

  return (
    <div className="calendar-container">
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

          {showCreateEventButton && (
            <button onClick={handleCreateEvent}>Create Event</button>
          )}

          {eventsForSelectedDate.length > 0 && (
            <button onClick={handleInvite}>Invite</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;

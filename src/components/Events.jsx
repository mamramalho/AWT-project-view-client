import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EventsStyles.css";

function Events() {
  const [listOfEvents, setListOfEvents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/event").then((response) => {
      setListOfEvents(response.data);
    });
  }, []);

  const handleEdit = (event) => {
    const eventId = event.target.dataset.eventId;
    // Open a window or modal with the event details for editing
    console.log("Edit event with ID:", eventId);
  };

  const handleInvite = (event) => {
    const eventId = event.target.dataset.eventId;
    // Open a window or modal with the invitation form for the event
    console.log("Invite people to event with ID:", eventId);
  };

  const handleDelete = (event) => {
    const eventId = event.target.dataset.eventId;
    // Delete the event from the user's account
    console.log("Delete event with ID:", eventId);
  };

  return (
    <div className="event-container">
      <div className="new">
        <button className="newEvent" type="submit">
          Create Event
        </button>
      </div>
      <ul>
        {listOfEvents.map((value, index) => {
          return (
            <div className="event" key={index}>
              <div className="optionsEvent">
                <button
                  className="editEvent"
                  type="button"
                  data-event-id={value.id}
                  onClick={handleEdit}
                >
                  Edit
                </button>
                <button
                  className="inviteEvent"
                  type="button"
                  data-event-id={value.id}
                  onClick={handleInvite}
                >
                  Invite
                </button>
                <button
                  className="deleteEvent"
                  type="button"
                  data-event-id={value.id}
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
              <div className="titleEvent">{value.title}</div>
              <div className="descriptionEvent">{value.description}</div>
            </div>
          );
        })}
      </ul>
    </div>
  );
}

export default Events;

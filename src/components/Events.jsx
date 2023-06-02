import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EventsStyles.css";

function EventForm({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const newEvent = {
        title,
        date,
        description,
      };

      const response = await axios.post("http://localhost:3001/events/create", newEvent);
      onCreate(response.data);
      onClose();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={handleDateChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          required
        ></textarea>
      </div>
      <div className="form-actions">
        <button type="submit">Create</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function EventEditForm({ eventId, onClose, onUpdate }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/events/${eventId}`);
        const event = response.data;
        setTitle(event.title);
        setDate(event.date);
        setDescription(event.description);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const updatedEvent = {
        title,
        date,
        description,
      };

      const response = await axios.put(
        `http://localhost:3001/events/${eventId}`,
        updatedEvent
      );
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={handleDateChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          required
        ></textarea>
      </div>
      <div className="form-actions">
        <button type="submit">Update</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function Events() {
  const [listOfEvents, setListOfEvents] = useState([]);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [editEventId, setEditEventId] = useState(null);

  const handleCreateEvent = (newEvent) => {
    setListOfEvents((prevList) => [...prevList, newEvent]);
  };

  const handleUpdateEvent = (updatedEvent) => {
    setListOfEvents((prevList) =>
      prevList.map((event) => {
        if (event.events_id === updatedEvent.events_id) {
          return updatedEvent;
        }
        return event;
      })
    );
  };

  const openCreateEvent = () => {
    setIsCreateEventOpen(true);
  };

  const closeCreateEvent = () => {
    setIsCreateEventOpen(false);
  };

  const openEditEvent = (eventId) => {
    setIsEditEventOpen(true);
    setEditEventId(eventId);
  };

  const closeEditEvent = () => {
    setIsEditEventOpen(false);
    setEditEventId(null);
  };

  useEffect(() => {
    axios.get("http://localhost:3001/events").then((response) => {
      setListOfEvents(response.data);
    });
  }, []);

  const handleEdit = (eventId) => {
    openEditEvent(eventId);
  };

  const handleInvite = (eventId) => {
    console.log("Invite people to event with ID:", eventId);
  };

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`http://localhost:3001/events/${eventId}`);
      setListOfEvents((prevList) =>
        prevList.filter((event) => event.events_id !== eventId)
      );
      console.log("Event deleted successfully with ID:", eventId);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="event-container">
      <div className="new">
        <button className="newEvent" type="button" onClick={openCreateEvent}>
          Create Event
        </button>
      </div>
      {isCreateEventOpen && (
        <div className="event-popup">
          <EventForm onClose={closeCreateEvent} onCreate={handleCreateEvent} />
        </div>
      )}
      <ul>
        {listOfEvents.map((value) => {
          return (
            <div className="event" key={value.events_id}>
              <div className="optionsEvent">
                <button
                  className="editEvent"
                  type="button"
                  onClick={() => handleEdit(value.events_id)}
                >
                  Edit
                </button>
                {isEditEventOpen && editEventId === value.events_id && (
                  <div className="event-popup">
                    <EventEditForm
                      eventId={editEventId}
                      onClose={closeEditEvent}
                      onUpdate={handleUpdateEvent}
                    />
                  </div>
                )}
                <button
                  className="inviteEvent"
                  type="button"
                  onClick={() => handleInvite(value.events_id)}
                >
                  Invite
                </button>
                <button
                  className="deleteEvent"
                  type="button"
                  onClick={() => handleDelete(value.events_id)}
                >
                  Delete
                </button>
              </div>
              <div className="titleEvent">{value.title}</div>
              <div className="dateEvent">{value.date}</div>
              <div className="descriptionEvent">{value.description}</div>
            </div>
          );
        })}
      </ul>
    </div>
  );
}

export default Events;
/* 

// client-side code

import React, { useState } from "react";
import axios from "axios";

function EventInviteForm({ eventId }) {
  const [email, setEmail] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleInvite = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/events/invite",
        {
          eventId,
          email,
        }
      );

      console.log(response.data.message);
      // Handle success or show a notification to the user
    } catch (error) {
      console.error("Error inviting user:", error);
      // Handle error or show an error message to the user
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Enter email"
      />
      <button onClick={handleInvite}>Invite</button>
    </div>
  );
}

export default EventInviteForm; */
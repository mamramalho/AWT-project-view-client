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

      const response = await axios.post("http://localhost:8080/event/create", newEvent, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      onCreate(response.data);
      onClose();
      window.location.reload();
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
        const response = await axios.get(`http://localhost:8080/event/${eventId}`, {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        });
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
        `http://localhost:8080/event/${eventId}/alter`, updatedEvent, {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        });
      onUpdate(response.data);
      onClose();
      window.location.reload();
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

function EventInviteForm({ eventId }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleInvite = async () => {
    try {
      if (!email || !message) {
        console.log("Email and message are required");
        return;
      }
      const response = await axios.post(
        "http://localhost:8080/invite",
        {
          eventId,
          email,
          message,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );

      console.log(response.data.message);
    } catch (error) {
      console.error("Error inviting user:", error);
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
      <textarea
        value={message}
        onChange={handleMessageChange}
        placeholder="Enter message"
      />
      <button onClick={handleInvite}>Invite</button>
    </div>
  );
}


function Events() {
  const [listOfEvents, setListOfEvents] = useState([]);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [isInviteFormOpen, setIsInviteFormOpen] = useState(false);

  const handleCreateEvent = (newEvent) => {
    setListOfEvents((prevList) => [...prevList, newEvent]);
  };

  const handleUpdateEvent = (updatedEvent) => {
    setListOfEvents((prevList) =>
      prevList.map((event) => {
        if (event.eventId === updatedEvent.eventId) {
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
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user/events", {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      setListOfEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleEdit = (eventId) => {
    openEditEvent(eventId);
  };

  const handleInvite = (eventId) => {
    setIsInviteFormOpen(eventId);
  };

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`http://localhost:8080/event/${eventId}/delete`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      setListOfEvents((prevList) =>
        prevList.filter((event) => event.eventId !== eventId)
      );
      console.log("Event deleted successfully with ID:", eventId);
      fetchEvents();
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
            <div className="event" key={value._id}>
              <div className="optionsEvent">
                <button
                  className="editEvent"
                  type="button"
                  onClick={() => handleEdit(value._id)}
                >
                  Edit
                </button>
                {isEditEventOpen && editEventId === value._id && (
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
                  onClick={() => handleInvite(value._id)}
                >
                  Invite
                </button>
                <button
                  className="deleteEvent"
                  type="button"
                  onClick={() => handleDelete(value._id)}
                >
                  Delete
                </button>
              </div>
              <div className="titleEvent">{value.title}</div>
              <div className="dateEvent">{new Date(value.date).toLocaleDateString()}</div>
              <div className="descriptionEvent">{value.description}</div>
            </div>
          );
        })}
      </ul>
      {isInviteFormOpen && (
        <div className="event-popup">
          <EventInviteForm
            eventId={isInviteFormOpen}
            fetchEvents={fetchEvents}
          />
        </div>
      )}
    </div>
  );
}

export default Events;
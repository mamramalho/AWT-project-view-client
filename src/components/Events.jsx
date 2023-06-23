import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./EventsStyles.css";
import Popup from 'reactjs-popup/dist/index';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import '@fortawesome/fontawesome-free/css/all.css';


function EventForm({ onClose, onCreate, selectedDate }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
  
    if (selectedDate) {
      setDate(selectedDate);
    }
  }, [selectedDate]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDate(selectedDate);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleMapSearch = async () => {
    try {
      // eslint-disable-next-line
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          address
        )}&key=3b30f6b7b53e424a89bfeb64f9dac974`
      );
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
  
        // Update state with current location
        setLatitude(latitude);
        setLongitude(longitude);
  
        // Set view and marker position on the map
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 13);
          markerRef.current.setLatLng([latitude, longitude]);
        }
      });
    } catch (error) {
      console.error('Error fetching geocode:', error);
    }
  };
  
  
  

  const initializeMap = (mapRef) => {
    const map = L.map(mapRef.current).setView([0, 0], 13);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);
  
    return map;
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const newEvent = {
        title,
        date,
        description,
        address,
        latitude,
        longitude,
      };

      const response = await axios.post('http://localhost:8080/event/create', newEvent, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      onCreate(response.data);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      // Set map view
      if (!mapRef.current) {
        mapRef.current = L.map(mapContainerRef.current).setView([latitude, longitude], 13);
        initializeMap(mapRef.current);
      } else {
        mapRef.current.setView([latitude, longitude], 13);
      }
  
      // Add tile layer to the map
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(mapRef.current);
  
      // Create marker and set its position
      const markerIcon = L.divIcon({
        html: '<i class="fas fa-map-marker-alt"></i>',
        className: 'custom-marker-icon',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
  
      const marker = L.marker([latitude, longitude], { icon: markerIcon }).addTo(mapRef.current);
  
      // Handle click event on the map to update latitude and longitude
      mapRef.current.on('click', (event) => {
        const { lat, lng } = event.latlng;
        setLatitude(lat);
        setLongitude(lng);
        marker.setLatLng([lat, lng]);
      });
  
      // Cleanup function
      return () => {
        mapRef.current.remove();
      };
    }
  }, [latitude, longitude]);
  
  return (
    <Popup open={true} closeOnDocumentClick onClose={onClose}>
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
          <div>
            <input
              type="text"
              value={address}
              onChange={handleAddressChange}
              placeholder="Enter address"
            />
            <button onClick={handleMapSearch}>Search</button>
            <div ref={mapContainerRef} style={{ width: '100%', height: '400px' }}></div>
          </div>
          <div className="form-actions">
            <button type="submit">Create</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
    </Popup>
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
    <Popup open={true} closeOnDocumentClick onClose={onClose}>
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
    </Popup>
  );
}

function EventInviteForm({ eventId }) {
  const [recipientEmail, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleInvite = async () => {
    try {
      if (!recipientEmail || !message) {
        console.log("Email and message are required");
        return;
      }
      const response = await axios.post(
        `http://localhost:8080/event/${eventId}/invite`,
        {
          recipientEmail,
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
    <Popup open={true} closeOnDocumentClick>
      <div className="event-popup"></div>
        <div className="form-group">
          <label htmlFor="recipientEmail">Invite: </label>
          <input
            type="email"
            value={recipientEmail}
            onChange={handleEmailChange}
            placeholder="Enter email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message: </label>
          <textarea
            id="message"
            value={message}
            onChange={handleMessageChange}
            placeholder="Enter message"
            required
          ></textarea>
        </div>
        <button onClick={handleInvite}>Invite</button>
    </Popup>
  );
}


function Events() {
  const [listOfEvents, setListOfEvents] = useState([]);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [isInviteFormOpen, setIsInviteFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

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

  const openCreateEvent = (selectedDate) => {
    setIsCreateEventOpen(true);
    setSelectedDate(selectedDate);
  };

  const closeCreateEvent = () => {
    setIsCreateEventOpen(false);
    setSelectedDate(null);
  };

  const openEditEvent = (eventId) => {
    setIsEditEventOpen(true);
    setEditEventId(eventId);
  };

  const closeEditEvent = () => {
    setIsEditEventOpen(false);
    setEditEventId(null);
  };

  const closeInviteForm = () => {
    setIsInviteFormOpen(false);
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
    <div className={`event-container ${isCreateEventOpen || isEditEventOpen || isInviteFormOpen ? 'popup-open' : ''}`}>
    <div className="event-container">
      <div className="new">
        <button className="newEvent" type="button" onClick={openCreateEvent}>
          Create Event
        </button>
      </div>
      {isCreateEventOpen && (
        <>
          <div className="popup-overlay" onClick={closeCreateEvent} />
          <div className={`popup-container ${isCreateEventOpen ? 'active' : ''}`}>
          <div className="event-popup">
            <EventForm
              onClose={closeCreateEvent}
              onCreate={handleCreateEvent}
              selectedDate={selectedDate}
            />
          </div>
          </div>
        </>
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
                {isEditEventOpen && editEventId && (
                  <>
                    <div className="popup-overlay" onClick={closeEditEvent} />
                    <div className={`popup-container ${isEditEventOpen ? 'active' : ''}`}>
                    <div className="event-popup">
                      <EventEditForm
                        eventId={editEventId}
                        onClose={closeEditEvent}
                        onUpdate={handleUpdateEvent}
                      />
                    </div>
                    </div>
                  </>
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
        <>
          <div className="popup-overlay" onClick={closeInviteForm} />
          <div className={`popup-container ${isInviteFormOpen ? 'active' : ''}`}>
          <div className="event-popup">
          <EventInviteForm eventId={isInviteFormOpen} onClose={closeInviteForm} onCreate={handleInvite} />
          </div>
          </div>
        </>
      )}
    </div>
    </div>
  );
}

export default Events;
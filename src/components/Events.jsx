import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import "./EventsStyles.css"

function Events() {
  const [listOfEvents, setListOfEvents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/event").then((response) => {
      setListOfEvents(response.data);
    });
  });

  return (
    <div className="App">
      <ul>
        {listOfEvents.map((value, key) => {
          return (
            <div className="events">
              <div className="title">{value.title}</div>
              <button className="delete" type="submit">Delete</button>
              <div className="description">{value.description}</div>
            </div>
          );
        })}
      </ul>
    </div>
  );
}

export default Events;

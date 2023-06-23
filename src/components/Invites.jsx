import React, { useEffect, useState } from "react";
import axios from "axios";
import "./InviteStyles.css";

const Invites = () => {
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    try {
      const response = await axios.get('http://localhost:8080/invite/incoming', {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      setInvites(response.data);
    } catch (error) {
      console.error('Error fetching invites:', error);
    }
  };

  const handleAccept = async (inviteId) => {
    try {
      await axios.post(`http://localhost:8080/invite/${inviteId}/accept`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      setInvites(invites.filter(invite => invite._id !== inviteId));
    } catch (error) {
      console.error('Error accepting invite:', error);
    }
  };

  const handleDecline = async (inviteId) => {
    try {
      await axios.post(`http://localhost:8080/invite/${inviteId}/decline`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      setInvites(invites.filter(invite => invite._id !== inviteId));
    } catch (error) {
      console.error('Error declining invite:', error);
    }
  };

  return (
    <div className="invite-container">
      <h2 className="main">Invites List</h2>
      {invites.length === 0 ? (
        <p>No invites found.</p>
      ) : (
        <ul>
          {invites.map(invite => (
            <li key={invite._id}>
              <div className="invite">
              {invite.status === 'pending' && (
                <div className="optionsInvite">
                  <button onClick={() => handleAccept(invite._id)}>Accept</button>
                  <button onClick={() => handleDecline(invite._id)}>Decline</button>
                </div>
              )}
                <div className="from">Invite ID: 
                <div className="fromFrom">{invite._id}</div></div>
                <div className="message">Message: 
                <div className="messageMessage">{invite.message}</div></div>
                <div className="status">Status: 
                <div className="statusStatus">{invite.status}</div></div>
                
              </div> 
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Invites;

import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { FlashMessageContext } from './FlashMessageContext';
import { useNavigate } from 'react-router-dom';

const Summary = () => {
  const { user, setUser } = useContext(UserContext);
  const { flashMessage } = useContext(FlashMessageContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Current user context:", user);
    console.log("Local storage user:", localStorage.getItem('user'));
  }, [user]);

  const getDisplayName = () => {
    if (user?.username) {
      console.log("Using username from context:", user.username);
      return user.username;
    }
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("Using username from localStorage:", parsedUser.username);
        return parsedUser.username;
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
    console.log("No username found, using default");
    return 'User';
  };

  return (
    <div className="summary-container">
      <div className="summary-header">
        <h2>Hi {getDisplayName()}!</h2>
      </div>
      <hr className="divider" />

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>3.74k</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>0</span>{" "}
            </p>
            <p>
              Opening balance <span>3.74k</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings (13)</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className="profit">
              1.55k <small>+5.20%</small>{" "}
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>31.43k</span>{" "}
            </p>
            <p>
              Investment <span>29.88k</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </div>
  );
};

export default Summary;
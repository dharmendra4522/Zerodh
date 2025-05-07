import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleLogout = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("No token found in localStorage");
            // Still clear local data and redirect
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            window.location.href = "http://localhost:3000/login";
            return;
        }

        console.log("Attempting logout with token:", token);

        // Call backend logout endpoint to clear the token
        const response = await axios.post("http://localhost:4000/api/logout", {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            withCredentials: true // Important for cookie handling
        });

        console.log("Logout response:", response.data);

        // Clear all local storage
        localStorage.clear();
        
        // Clear user context
        setUser(null);
        
        // Show success message
        toast.success("Logged out successfully");
        
        // Force reload to clear any cached data
        window.location.href = "http://localhost:3000/login";
    } catch (error) {
        console.error("Logout error:", error);
        // Still clear everything even if server request fails
        localStorage.clear();
        setUser(null);
        window.location.href = "http://localhost:3000/login";
    }
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <img 
        src={process.env.PUBLIC_URL + '/logo.png'} 
        alt="Zerodha Logo" 
        style={{ width: "50px", height: "auto" }} 
      />
      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="funds"
              onClick={() => handleMenuClick(4)}
            >
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/apps"
              onClick={() => handleMenuClick(6)}
            >
              <p className={selectedMenu === 6 ? activeMenuClass : menuClass}>
                Apps
              </p>
            </Link>
          </li>
        </ul>
        <hr />
        <div className="profile" onClick={handleProfileClick}>
          {/* <div className="avatar">ZU</div>
          <p className="username">USERID</p> */}
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          {/* <Link
            style={{ textDecoration: "none" }}
            to="/Login">
            Login
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default Menu;
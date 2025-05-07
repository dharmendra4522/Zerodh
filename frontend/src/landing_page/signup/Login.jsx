import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState({
    email: "",
    password: ""
  });
  const { email, password } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "top-center",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "top-center",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting login with:", { email });
      const { data } = await axios.post(
        "http://localhost:4000/api/login", 
        {
          ...inputValue,
        },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      console.log("Login response:", data);

      if (data.success) {
        handleSuccess(data.message);
        // Store token in localStorage
        localStorage.setItem("token", data.token);
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("Stored user data:", data.user);
        
        // Wait for a moment to ensure data is stored
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirect to dashboard application
        window.location.href = "http://localhost:3001";
      } else {
        handleError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      handleError(errorMessage);
    }
    setInputValue({
      email: "",
      password: "",
    });
  };

  return (
    <div className="container mt-5 pt-5 pb-3">
      <div className="row align-items-center">
        {/* Image section */}
        <div className="col-md-6 text-center">
          <img
            src="media/images/signup.png" 
            alt="Login"
            className="img-fluid"
            style={{ maxHeight: "400px" }}
          />
        </div>

        {/* Form section */}
        <div className="col-md-6">
          <div className="shadow-lg p-3 mb-5 bg-white rounded">
            <h2 className="text-center mb-4">Login to Zerodha</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={handleOnChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  placeholder="Enter your password"
                  onChange={handleOnChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
            <div className="mt-3 text-center">
              Don't have an account?{" "}
              <Link to="/signup" style={{ textDecoration: "none" }}>
                Signup
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;

import { Route, Routes } from "react-router-dom";
import {  Signup } from "./landing_page";
import Home from "./landing_page/Home";
import Login from "./landing_page/signup/Login";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
      
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
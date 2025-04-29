import React from "react";

function Team() {
  return (
    <div className="container">
      <div className="row  ">
        <h2 className="text-center" style={{ color: "#424242" }}>
          People
        </h2>
      </div>
      <div
        className="row   p-5 "

      >

        <div className="col-5 text-center ">
          <img
            src="media/images/me.jpeg"
            alt="team "
            style={{ borderRadius: "100%", width: "60%", height: "300px" }}
          />
          <h5>Dharmendra Vishvkarma</h5>
          <p>Developer</p>

        </div>


        <div className="col-5 mt-3 fs-6 teamhistory" >
          <p>
            I’m the developer of this website and currently pursuing a B.Tech in Information Technology at AKGEC (Ajay Kumar Garg Engineering College), Ghaziabad.</p>
          <p> I'm passionate about web development and love building responsive, user-friendly applications that solve real-world problems. Beyond coding.</p> <p> I enjoy playing cricket—it’s my go-to for fun and focus.</p>
          <p>Connect on <a href="/" style={{ textDecoration: "none" }}> Homepage</a>  / <a href="/" style={{ textDecoration: "none" }}> TradingQnA</a> /<a href="/" style={{ textDecoration: "none" }}> Twitter</a>
          </p>

        </div>

      </div>
    </div>

  );
}

export default Team;
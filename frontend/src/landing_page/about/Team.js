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
            src="media\images/me.jpeg"
            alt="team "
            style={{ borderRadius: "100%", width: "60%", height:"300px" }}
          />
          <h5>Dharmendra Vishvkarma</h5>
          <p>Developer</p>

               </div>

       
        <div className="col-5 mt-3 fs-6 teamhistory" >
          <p>
            Nithin bootstrapped and founded Zerodha in 2010 to overcome the

            hurdles he faced during his decade long stint as a trader. Today,
            Zerodha has changed the landscape of the Indian broking industry.</p>
            <p>He
            is a member of the SEBI Secondary Market Advisory Committee (SMAC)
            and the Market Data Advisory Committee (MDAC).</p> <p> Playing basketball is
            his zen.</p>  <p>Connect on <a href="/" style={{textDecoration:"none"}}> Homepage</a>  / <a href="/" style={{textDecoration:"none"}}> TradingQnA</a> /<a href="/" style={{textDecoration:"none"}}> Twitter</a>
          </p>
        
        </div>
 
      </div>
      </div>
        
  );
}

export default Team;
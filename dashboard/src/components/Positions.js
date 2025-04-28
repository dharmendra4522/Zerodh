import React, { useState, useEffect } from "react";
import axios from "axios";

const Positions = () => {
  const [allPosition, setAllPosition] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await axios.get("http://localhost:4000/allPositions");
        console.log(res.data);
        setAllPosition(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching positions:", err);
        setError("Failed to fetch positions. Please try again later.");
      }
    };

    fetchPositions();
  }, []);

  return (
    <>
      <h3 className="title">Positions ({allPosition.length})</h3>
      {error && <div className="error-message">{error}</div>}

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>
          <tbody>
            {allPosition.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const isProfit = curValue - stock.avg * stock.qty >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.product}</td>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td className={profClass}>
                    {(curValue - stock.avg * stock.qty).toFixed(2)}
                  </td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;

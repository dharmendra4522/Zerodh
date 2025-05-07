import React, { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import { FlashMessageContext } from "./FlashMessageContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const { closeBuyWindow } = useContext(GeneralContext);
  const { setFlashMessage } = useContext(FlashMessageContext);

  const handleBuyClick = async () => {
    try {
      // Validate inputs
      if (stockPrice <= 0) {
        setFlashMessage({
          success: '',
          error: 'Please enter a valid price.'
        });
        return;
      }

      if (stockQuantity <= 0) {
        setFlashMessage({
          success: '',
          error: 'Please enter a valid quantity.'
        });
        return;
      }

      // Get token from localStorage
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? 'Present' : 'Missing');
      
      if (!token) {
        setFlashMessage({
          success: '',
          error: 'Please login to place an order.'
        });
        return;
      }

      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      console.log('User data from localStorage:', userData);
      
      if (!userData || !userData._id) {
        setFlashMessage({
          success: '',
          error: 'User data not found. Please login again.'
        });
        return;
      }

      const orderData = {
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        mode: "BUY",
        userId: userData._id
      };

      console.log('Attempting to place order with data:', orderData);

      const response = await axios.post("http://localhost:4000/api/newOrder", orderData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Order response:', response.data);

      if (response.data.success) {
        setFlashMessage({
          success: response.data.message || 'Order placed successfully!',
          error: ''
        });
        closeBuyWindow();
      } else {
        console.error('Order placement failed:', response.data);
        setFlashMessage({
          success: '',
          error: response.data.error || 'Failed to place order. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      setFlashMessage({
        success: '',
        error: error.response?.data?.error || error.message || 'Failed to place order. Please try again.'
      });
    }
  };

  const handleCancelClick = () => {
    closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(parseInt(e.target.value))}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              min="0.01"
              step="0.05"
              onChange={(e) => setStockPrice(parseFloat(e.target.value))}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹{(stockQuantity * stockPrice * 0.1).toFixed(2)}</span>
        <div>
          <button className="btn btn-blue" onClick={handleBuyClick}>
            Buy
          </button>
          <button className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;

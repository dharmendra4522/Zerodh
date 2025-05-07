import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FlashMessageContext } from "./FlashMessageContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const { setFlashMessage } = useContext(FlashMessageContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setFlashMessage({
            success: '',
            error: 'Please login to view orders.'
          });
          return;
        }

        const response = await axios.get("http://localhost:4000/api/allOrders", {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setOrders(response.data.allOrders || []);
          setFilteredOrders(response.data.allOrders || []);
        } else {
          setFlashMessage({
            success: '',
            error: 'Failed to fetch orders.'
          });
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setFlashMessage({
          success: '',
          error: 'Failed to fetch orders. Please try again.'
        });
      }
    };

    fetchOrders();
  }, [setFlashMessage]);

  useEffect(() => {
    let result = orders;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(order => 
        order.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "ALL") {
      result = result.filter(order => order.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "ALL") {
      result = result.filter(order => order.mode === typeFilter);
    }

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, typeFilter, orders]);

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:4000/api/allorders/${orderId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.message === 'Order deleted successfully') {
        setOrders(orders.filter(order => order._id !== orderId));
        setFlashMessage({
          success: 'Order cancelled successfully',
          error: ''
        });
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      setFlashMessage({
        success: '',
        error: 'Failed to cancel order. Please try again.'
      });
    }
  };

  if (orders.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <Link to={"/"} className="btn">
            Get started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders">
      <h2 className="title">Orders</h2>
      
      {/* Filters and Search */}
      <div className="filters" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search stocks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select 
          value={typeFilter} 
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="ALL">All Types</option>
          <option value="BUY">Buy</option>
          <option value="SELL">Sell</option>
        </select>
      </div>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Stock</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={index}>
                <td>{order.name}</td>
                <td className={order.mode === 'BUY' ? 'profit' : 'loss'}>
                  {order.mode}
                </td>
                <td>{order.qty}</td>
                <td>₹{order.price.toFixed(2)}</td>
                <td>{order.status}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  {order.status === 'PENDING' && (
                    <button 
                      onClick={() => handleCancelOrder(order._id)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#ff4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
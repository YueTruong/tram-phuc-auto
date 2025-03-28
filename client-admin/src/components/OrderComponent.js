import React, { useEffect, useState } from "react";
import axios from "axios";

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("/api/admin/order", {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            // Đảm bảo dữ liệu là mảng
            setOrders(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]); // Nếu lỗi, đặt về mảng rỗng
        }
    };

    return (
        <div className="container mt-4">
            <h2>Order Management</h2>
            {loading ? (
                <p>Loading orders...</p>
            ) : !Array.isArray(orders) ? (
                <p className="text-danger">Error: Orders data is invalid.</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <table className="table table-bordered">
                    <thead className="table-light">
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Total Price</th>
                            <th>Status</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.customer?.name || "Unknown"}</td>
                                <td>${order.total.toFixed(2)}</td>
                                <td>{order.status}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary">
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Order;
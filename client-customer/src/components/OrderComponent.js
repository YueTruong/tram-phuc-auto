import React, { Component } from "react";
import axios from "axios";
import MyContext from "../contexts/MyContext";

class Order extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            loading: true,
            error: "",
        };
    }

    componentDidMount() {
        this.fetchOrders();
    }

    fetchOrders = async () => {
        const { token } = this.context;
        if (!token) {
            this.setState({ error: "Please login", loading: false });
            return;
        }
        try {
            const response = await axios.get("/api/customer/orders", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Customer orders:", response.data); // Debug
            this.setState({ 
                orders: Array.isArray(response.data) ? response.data : [],
                loading: false,
                error: ""
            });
        } catch (error) {
            console.error("Error fetching orders:", error.response?.data || error.message);
            this.setState({ 
                orders: [], 
                loading: false, 
                error: "Failed to fetch orders" 
            });
        }
    };

    render() {
        const { orders, loading, error } = this.state;

        return (
            <div className="container mt-5 order-container">
                <h2 className="text-center mb-4 order-title">My Orders</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <p className="text-center text-muted">No orders found.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered align-middle text-center order-table">
                            <thead className="table-primary">
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Total Price</th>
                                    <th>Status</th>
                                    <th>Items</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{new Date(order.cdate).toLocaleDateString()}</td>
                                        <td>${order.total.toFixed(2)}</td>
                                        <td>
                                            <span className={`badge ${order.status === "Pending" ? "bg-warning" : "bg-success"}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="text-start">
                                            <ul className="list-unstyled mb-0">
                                                {order.items.map((item, index) => (
                                                    <li key={index}>
                                                        <strong>{item.product?.name || "Unknown"}</strong> - {item.quantity} × ${item.product?.price?.toFixed(2) || "0.00"}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }
}

export default Order;

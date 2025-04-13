import React, { Component } from "react";
import axios from "axios";
import MyContext from "../contexts/MyContext";

class Orders extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            loading: false,
            message: "",
        };
    }

    componentDidMount() {
        this.fetchOrders();
    }

    fetchOrders = async () => {
        const { token } = this.context;
        if (!token) {
            this.setState({ message: "Please login to view orders" });
            return;
        }
        this.setState({ loading: true, message: "" });
        try {
            const response = await axios.get("/api/customer/orders", {
                headers: { Authorization: `Bearer ${token}` },
            });
            this.setState({ orders: response.data || [], loading: false });
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to fetch orders";
            console.log("Server error details:", error.response?.data);
            this.setState({ message: errorMessage, loading: false });
            console.error("Fetch orders error:", error);
        }
    };

    render() {
        const { orders, loading, message } = this.state;
        return (
            <div className="container mt-4">
                <h2>My Orders</h2>
                {message && <div className="alert alert-info">{message}</div>}
                {loading ? (
                    <p>Loading...</p>
                ) : orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    <div className="list-group">
                        {orders.map((order) => (
                            <div key={order._id} className="list-group-item">
                                <h5>Order #{order._id}</h5>
                                <p>Total: ${order.total.toFixed(2)}</p>
                                <p>Status: {order.status}</p>
                                <p>Date: {new Date(order.cdate).toLocaleDateString()}</p>
                                <h6>Items:</h6>
                                <ul>
                                    {order.items.map((item, index) => (
                                        <li key={index}>
                                            {item.product.name} - Quantity: {item.quantity} - Price: ${item.product.price.toFixed(2)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

export default Orders;
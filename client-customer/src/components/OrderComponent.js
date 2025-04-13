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
        if (!token) return;
        this.setState({ loading: true });
        try {
            const response = await axios.get("/api/customer/orders", {
                headers: { Authorization: `Bearer ${token}` },
            });
            this.setState({ orders: response.data, loading: false });
        } catch (error) {
            this.setState({ message: "Failed to fetch orders", loading: false });
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
                    <ul>
                        {orders.map((order) => (
                            <li key={order._id}>
                                Order #{order._id} - Total: ${order.total} - Status: {order.status}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
}

export default Orders;
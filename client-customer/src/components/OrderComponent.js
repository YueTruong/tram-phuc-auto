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
            <div className="container mt-4">
                <h2>My Orders</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {loading ? (
                    <p>Loading orders...</p>
                ) : orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    <table className="table table-bordered">
                        <thead className="table-light">
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
                                    <td>{order.status}</td>
                                    <td>
                                        <ul>
                                            {order.items.map((item, index) => (
                                                <li key={index}>
                                                    {item.product?.name || "Unknown"} - {item.quantity} x ${item.product?.price?.toFixed(2) || "0.00"}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    }
}

export default Order;
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
            this.setState({ error: "Please login as admin", loading: false });
            return;
        }
        try {
            this.setState({ loading: true, error: "" });
            const response = await axios.get("/api/admin/orders", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Fetched orders:", response.data); // Debug
            this.setState({ 
                orders: Array.isArray(response.data) ? response.data : [],
                loading: false
            });
        } catch (error) {
            console.error("Error fetching orders:", error.response?.data || error.message);
            this.setState({ 
                orders: [], 
                loading: false, 
                error: error.response?.data?.error || "Failed to fetch orders"
            });
        }
    };

    updateOrderStatus = async (orderId, newStatus) => {
        const { token } = this.context;
        if (!token) {
            this.setState({ error: "Please login as admin" });
            return;
        }
        try {
            const response = await axios.patch(
                `/api/admin/orders/${orderId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Updated order:", response.data); // Debug
            this.setState(prevState => ({
                orders: prevState.orders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                ),
                error: ""
            }));
        } catch (error) {
            console.error("Error updating status:", error.response?.data || error.message);
            this.setState({ 
                error: error.response?.data?.error || `Failed to update order ${orderId}`
            });
        }
    };

    render() {
        const { orders, loading, error } = this.state;
        const statusOptions = ["Pending", "Approved", "Shipped", "Delivered", "Cancelled"];

        return (
            <div className="container mt-4">
                <h2>Order Management</h2>
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
                                <th>Customer</th>
                                <th>Total Price</th>
                                <th>Status</th>
                                <th>Actions</th>
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
                                        <select
                                            value={order.status}
                                            onChange={(e) => this.updateOrderStatus(order._id, e.target.value)}
                                            className="form-select form-select-sm d-inline-block w-auto"
                                        >
                                            {statusOptions.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                        <button
                                            className="btn btn-sm btn-primary ms-2"
                                            onClick={() => alert(JSON.stringify(order, null, 2))}
                                        >
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
    }
}

export default Order;
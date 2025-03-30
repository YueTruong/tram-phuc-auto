import React, { Component } from "react";
import axios from "axios";

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            loading: true,
        };
    }

    componentDidMount() {
        this.fetchOrders();
    }

    fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("/api/admin/orders", {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            this.setState({ 
                orders: Array.isArray(response.data) ? response.data : [],
                loading: false
            });
        } catch (error) {
            console.error("Error fetching orders:", error);
            this.setState({ orders: [], loading: false });
        }
    };

    render() {
        const { orders, loading } = this.state;

        return (
            <div className="container mt-4">
                <h2>Order Management</h2>
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
    }
}

export default Order;
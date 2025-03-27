import axios from "axios";
import React, { Component } from "react";
import withRouter from "../utils/withRouter";

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            message: "",
            filterStatus: "all",
        };
    }

    componentDidMount() {
        this.fetchOrders();
    }

    fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("/api/customer/orders", {
                headers: { Authorization: `Bearer ${token}` },
            });
            this.setState({ orders: res.data });
        } catch (error) {
            this.setState({ message: error.response?.data?.message || "Failed to fetch orders" });
        }
    };

    cancelOrder = async (orderId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`/api/customer/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            this.fetchOrders();
        } catch (error) {
            this.setState({ message: error.response?.data?.message || "Failed to cancel order" });
        }
    };

    handleFilterChange = (e) => {
        this.setState({ filterStatus: e.target.value });
    };

    render() {
        const filteredOrders = this.state.filterStatus === "all"
            ? this.state.orders
            : this.state.orders.filter(order => order.status === this.state.filterStatus);

        return (
            <div className="container mt-5">
                <h2>Order History</h2>
                {this.state.message && <p className="text-danger">{this.state.message}</p>}
                <div className="mb-3">
                    <label>Filter by Status:</label>
                    <select className="form-select" onChange={this.handleFilterChange} value={this.state.filterStatus}>
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                {filteredOrders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    <ul className="list-group">
                        {filteredOrders.map((order) => (
                            <li key={order._id} className="list-group-item">
                                <strong>Order ID:</strong> {order._id} <br />
                                <strong>Total:</strong> ${order.total} <br />
                                <strong>Status:</strong> {order.status} <br />
                                <strong>Items:</strong>
                                <ul>
                                    {order.items.map((item) => (
                                        <li key={item.product._id}>
                                            {item.product.name} - {item.quantity} pcs
                                        </li>
                                    ))}
                                </ul>
                                {order.status === "pending" && (
                                    <button className="btn btn-danger mt-2" onClick={() => this.cancelOrder(order._id)}>
                                        Cancel Order
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
}

export default withRouter(Order);
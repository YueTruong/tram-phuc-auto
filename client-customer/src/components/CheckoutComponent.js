import React, { Component } from "react";
import axios from "axios";
import MyContext from "../contexts/MyContext";
import withRouter from "../utils/withRouter";

class Checkout extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            message: "",
        };
    }

    render() {
        const { mycart = [] } = this.context;
        const { message, loading } = this.state;
        const totalPrice = mycart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        return (
            <div className="container mt-4">
                <h2>Checkout</h2>
                {message && <div className="alert alert-info">{message}</div>}
                {mycart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <div>
                        <h4>Order Summary</h4>
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mycart.map((item) => (
                                    <tr key={item._id || Math.random()}>
                                        <td>{item.name}</td>
                                        <td>${item.price.toFixed(2)}</td>
                                        <td>{item.quantity}</td>
                                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-between align-items-center border-top pt-3">
                            <h5>Total:</h5>
                            <h5 className="fw-bold text-success">${totalPrice.toFixed(2)}</h5>
                        </div>
                        <button
                            className="btn btn-primary w-100 mt-3"
                            onClick={this.handleConfirmOrder}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Confirm Order"}
                        </button>
                    </div>
                )}
            </div>
        );
    }

    handleConfirmOrder = async () => {
        const { mycart, clearCart } = this.context;
        if (mycart.length === 0) {
            this.setState({ message: "Your cart is empty!" });
            return;
        }
        const token = this.context.token;
        if (!token) {
            this.setState({ message: "Please login before checkout." });
            this.props.navigate("/login");
            return;
        }
        this.setState({ loading: true, message: "" });
        try {
            const orderData = {
                items: mycart.map((item) => {
                    if (!item._id) throw new Error("Invalid product ID");
                    return {
                        productId: item._id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                    };
                }),
                total: mycart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            };
            console.log("Sending order data:", JSON.stringify(orderData, null, 2));
            const response = await axios.post("/api/customer/orders", orderData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 201) {
                this.setState({ message: "Order placed successfully!" });
                clearCart();
            }
        } catch (error) {
            console.error("Checkout error:", error);
            const errorMessage = error.response?.data?.error || error.message || "Unknown error";
            this.setState({ message: `Failed to place order: ${errorMessage}` });
        }
        this.setState({ loading: false });
    };
}

export default withRouter(Checkout);
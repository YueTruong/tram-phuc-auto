import React, { Component } from "react";
import axios from "axios";
import MyContext from "../contexts/MyContext";

class Checkout extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props);
        this.state = {
            address: "",
            phone: "",
            loading: false,
            message: "",
        };
    }

    handleInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleCheckout = async () => {
        const { mycart, clearCart } = this.context;
        const { address, phone } = this.state;

        if (mycart.length === 0) {
            this.setState({ message: "Your cart is empty!" });
            return;
        }

        if (!address || !phone) {
            this.setState({ message: "Please enter your address and phone number." });
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            this.setState({ message: "Please log in before checking out." });
            return;
        }

        this.setState({ loading: true, message: "" });

        try {
            const orderData = {
                items: mycart.map((item) => ({
                    productId: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
                total: mycart.reduce((sum, item) => sum + item.price * item.quantity, 0),
                address,
                phone,
            };

            const response = await axios.post("/api/customer/orders", orderData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 201) {
                this.setState({ message: "Order placed successfully!" });
                clearCart();
            }
        } catch (error) {
            this.setState({ message: "Failed to place order. Please try again." });
            console.error("Checkout error:", error);
        }

        this.setState({ loading: false });
    };

    render() {
        const { mycart = [] } = this.context;
        const { address, phone, loading, message } = this.state;
        const totalPrice = mycart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        return (
            <div className="container mt-4">
                <h2>Checkout</h2>
                {message && <div className="alert alert-info">{message}</div>}

                {mycart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <div>
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
                                    <tr key={item._id}>
                                        <td>{item.name}</td>
                                        <td>${item.price.toFixed(2)}</td>
                                        <td>{item.quantity}</td>
                                        <td className="fw-bold">${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="border-top pt-3">
                            <h5>Total: <span className="fw-bold text-success">${totalPrice.toFixed(2)}</span></h5>
                        </div>

                        <div className="mt-4">
                            <label className="form-label">Address:</label>
                            <input
                                type="text"
                                name="address"
                                className="form-control"
                                value={address}
                                onChange={this.handleInputChange}
                                required
                            />

                            <label className="form-label mt-3">Phone:</label>
                            <input
                                type="text"
                                name="phone"
                                className="form-control"
                                value={phone}
                                onChange={this.handleInputChange}
                                required
                            />
                        </div>

                        <button
                            className="btn btn-success mt-3 w-100"
                            onClick={this.handleCheckout}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Place Order"}
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default Checkout;
import axios from "axios";
import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import withRouter from "../utils/withRouter";

class Cart extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            message: "",
        };
    }

    handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) newQuantity = 1;
        if (newQuantity > 99) newQuantity = 99;
        this.context.updateCartQuantity(productId, newQuantity);
    };

    handleCheckout = async () => {
        const { mycart, clearCart } = this.context;
        if (mycart.length === 0) {
            this.setState({ message: "Your cart is empty!" });
            return;
        }
        const token = this.context.token; // Use context token
        if (!token) {
            this.setState({ message: "Please login before checkout." });
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
            };
            const response = await axios.post("/api/customer/orders", orderData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 201) {
                this.setState({ message: "Order placed successfully!" });
                clearCart();
                this.props.navigate("/checkout"); // Navigate after clearing
            }
        } catch (error) {
            this.setState({ message: "Failed to place order. Please try again." });
            console.error("Checkout error:", error);
        }
        this.setState({ loading: false });
    };

    render() {
        const { mycart = [], removeFromCart } = this.context;
        const { message } = this.state;
        const totalPrice = mycart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        return (
            <div className="container mt-4">
                <h2>Your Cart</h2>
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
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mycart.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item.name}</td>
                                        <td>${item.price.toFixed(2)}</td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control"
                                                style={{ width: "60px" }}
                                                value={item.quantity}
                                                min="1"
                                                max="99"
                                                onChange={(e) => this.handleQuantityChange(item._id, parseInt(e.target.value) || 1)}
                                            />
                                        </td>
                                        <td className="fw-bold">${(item.price * item.quantity).toFixed(2)}</td>
                                        <td>
                                            <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(item._id)}>
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-between align-items-center border-top pt-3">
                            <h5>Total:</h5>
                            <h5 className="fw-bold text-success">${totalPrice.toFixed(2)}</h5>
                        </div>
                        <button className="btn btn-primary mt-3 w-100" onClick={this.handleCheckout}>
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default withRouter(Cart);
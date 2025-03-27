import axios from "axios";
import React, { Component } from "react";
import MyContext from "../contexts/MyContext";

class Cart extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props);
        this.state = {
            loading: false, // Trạng thái khi xử lý checkout
            message: "", // Lưu thông báo checkout
        };
    }

    handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) newQuantity = 1;
        if (newQuantity > 99) newQuantity = 99;
        this.context.updateCartQuantity(productId, newQuantity);
    };

    handleCheckout = async () => {
        const { cart, clearCart } = this.context;
        if (cart.length === 0) {
            this.setState({ message: "Your cart is empty!" });
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            this.setState({ message: "Please login before checkout." });
            return;
        }

        this.setState({ loading: true, message: "" });

        try {
            const orderData = {
                items: cart.map((item) => ({
                    productId: item.productId,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
                total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
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
        const { cart = [], removeFromCart } = this.context || { cart: [], removeFromCart: () => {} };
        const { loading, message } = this.state;
        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        return (
            <div className="container mt-4">
                <h2>Your Cart</h2>
                {message && <div className="alert alert-info">{message}</div>}
                {cart.length === 0 ? (
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
                                {cart.map((item) => (
                                    <tr key={item.productId}>
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
                                                onChange={(e) => this.handleQuantityChange(item.productId, parseInt(e.target.value))}
                                            />
                                        </td>
                                        <td className="fw-bold">${(item.price * item.quantity).toFixed(2)}</td>
                                        <td>
                                            <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(item.productId)}>
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

                        <button className="btn btn-success mt-3 w-100" onClick={this.handleCheckout} disabled={loading}>
                            {loading ? "Processing..." : "Checkout"}
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default Cart;
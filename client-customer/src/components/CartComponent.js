import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import withRouter from "../utils/withRouter";

class Cart extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props);
        this.state = {
            message: "",
        };
    }

    handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) newQuantity = 1;
        if (newQuantity > 99) newQuantity = 99;
        this.context.updateCartQuantity(productId, newQuantity);
    };

    handleProceedToCheckout = () => {
        const { mycart } = this.context;
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
        this.setState({ message: "" });
        this.props.navigate("/checkout");
    };

    render() {
        const { mycart = [], removeFromCart } = this.context;
        const { message } = this.state;
        const totalPrice = mycart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        return (
            <div className="container my-5">
                <h2 className="mb-4 text-center text-primary">🛒 Your Shopping Cart</h2>
                {message && <div className="alert alert-warning text-center">{message}</div>}
                {mycart.length === 0 ? (
                    <p className="text-center text-muted">Your cart is empty.</p>
                ) : (
                    <div className="card shadow-sm rounded-4 p-4">
                        <table className="table align-middle text-center">
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
                                        <td className="fw-semibold">{item.name}</td>
                                        <td className="text-success">${item.price.toFixed(2)}</td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control mx-auto text-center"
                                                style={{ width: "80px", borderRadius: "0.5rem" }}
                                                value={item.quantity}
                                                min="1"
                                                max="99"
                                                onChange={(e) =>
                                                    this.handleQuantityChange(item._id, parseInt(e.target.value) || 1)
                                                }
                                            />
                                        </td>
                                        <td className="fw-bold text-success">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-outline-danger btn-sm rounded-pill"
                                                onClick={() => removeFromCart(item._id)}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="d-flex justify-content-between align-items-center border-top pt-4">
                            <h5 className="mb-0">Total:</h5>
                            <h4 className="fw-bold text-success mb-0">${totalPrice.toFixed(2)}</h4>
                        </div>

                        <button
                            className="btn btn-primary mt-4 w-100 py-2 rounded-pill"
                            onClick={this.handleProceedToCheckout}
                        >
                            🚀 Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default withRouter(Cart);
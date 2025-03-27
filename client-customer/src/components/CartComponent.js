import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

const CartComponent = () => {
    const { cart, updateCartQuantity, removeFromCart, clearCart } = useContext(CartContext);

    // Tính tổng giá trị giỏ hàng
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) newQuantity = 1;
        if (newQuantity > 99) newQuantity = 99;
        updateCartQuantity(productId, newQuantity);
    };

    const handleCheckout = async () => {
        alert("Checkout functionality will be implemented later!");
        clearCart();
    };

    return (
        <div className="container mt-4">
            <h2>Your Cart</h2>
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
                                            onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
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

                    {/* Tổng giá trị giỏ hàng */}
                    <div className="d-flex justify-content-between align-items-center border-top pt-3">
                        <h5>Total:</h5>
                        <h5 className="fw-bold text-success">${totalPrice.toFixed(2)}</h5>
                    </div>

                    <button className="btn btn-success mt-3 w-100" onClick={handleCheckout}>
                        Checkout
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartComponent;
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import axios from "axios";

const Inform = () => {
    const { cart } = useContext(CartContext); // Get cart data
    const [customer, setCustomer] = useState(null);
    const [showCart, setShowCart] = useState(false); // State to toggle cart preview

    useEffect(() => {
        fetchCustomer();

        const handleCustomerUpdate = () => fetchCustomer();
        window.addEventListener("customerUpdated", handleCustomerUpdate);

        return () => {
            window.removeEventListener("customerUpdated", handleCustomerUpdate);
        };
    }, []);

    const fetchCustomer = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const res = await axios.get("/api/customer/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCustomer(res.data);
            } catch (error) {
                console.error("Error fetching customer:", error);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("customer");
        setCustomer(null);
        window.location.href = "/";
    };

    return (
        <div className="border-bottom bg-light py-2 shadow-sm">
            <div className="container d-flex justify-content-between align-items-center">
                {/* User Authentication Links */}
                {!customer ? (
                    <div>
                        <Link to="/register" className="text-decoration-none me-3 text-dark">Sign-up</Link>
                        <Link to="/login" className="text-decoration-none me-3 text-dark">Login</Link>
                        <Link to="/activate" className="text-decoration-none text-dark">Activate</Link>
                    </div>
                ) : (
                    <div>
                        <span className="me-3 text-dark">Hello, {customer.name || customer.username || "Guest"}</span>
                        <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>Logout</button>
                    </div>
                )}

                {/* Cart Section with Preview */}
                <div className="position-relative">
                    <Link
                        to="/cart"
                        className="text-decoration-none text-dark"
                        onMouseEnter={() => setShowCart(true)}
                        onMouseLeave={() => setShowCart(false)}
                    >
                        My cart ({cart.length} items)
                    </Link>

                    {/* Cart Dropdown Preview */}
                    {showCart && cart.length > 0 && (
                        <div
                            className="position-absolute bg-white shadow rounded p-3"
                            style={{
                                top: "30px",
                                right: "0",
                                minWidth: "250px",
                                zIndex: 1000,
                            }}
                            onMouseEnter={() => setShowCart(true)}
                            onMouseLeave={() => setShowCart(false)}
                        >
                            <h6 className="border-bottom pb-2">Cart Preview</h6>
                            <ul className="list-unstyled">
                                {cart.slice(0, 3).map((item, index) => (
                                    <li key={index} className="d-flex justify-content-between mb-2">
                                        <span>{item.name}</span>
                                        <span className="fw-bold">${item.price} x {item.quantity}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link to="/cart" className="btn btn-sm btn-primary w-100">View Full Cart</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Inform;
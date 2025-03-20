import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // Authentication context
import { CartContext } from '../contexts/CartContext'; // Cart context

const Inform = () => {
    const { user, logout } = useContext(AuthContext); // Get auth state
    const { cartItems } = useContext(CartContext); // Get cart state

    return (
        <div className="border-bottom bg-light py-2 shadow-sm">
            <div className="container d-flex justify-content-between align-items-center">
                {/* Left Side: Authentication Links */}
                <div>
                    {user ? (
                        <>
                            <span className="me-3 text-dark">Hello, {user.username}!</span>
                            <Link to="#" onClick={logout} className="text-decoration-none me-3 text-dark">
                                Logout
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-decoration-none me-3 text-dark">Login</Link>
                            <Link to="/signup" className="text-decoration-none me-3 text-dark">Sign-up</Link>
                            <Link to="/activate" className="text-decoration-none text-dark">Activate</Link>
                        </>
                    )}
                </div>

                {/* Right Side: Cart Info */}
                <div>
                    <Link to="/cart" className="text-decoration-none text-dark">My cart</Link> have <b>{cartItems ? cartItems.length : 0}</b> items
                </div>
            </div>
        </div>
    );
};

export default Inform;
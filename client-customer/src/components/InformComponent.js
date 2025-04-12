import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Link } from 'react-router-dom';

class Inform extends Component {
    static contextType = MyContext; // Using this.context to access global state

    render() {
        const { token, customer, cart } = this.context;
        const totalItems = cart ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

        return (
            <div className="container-fluid bg-light py-0 border-bottom w-100" style={{ marginTop: '56px' }}>
                <div className="row align-items-center">
                    <div className="col-md-8 text-start">
                        {token === '' ? (
                            <div style={{paddingLeft: '12px'}}>
                                <Link to='/register' className="btn">Register</Link>
                                <span className="text-muted">|</span>
                                <Link to='/login' className="btn">Login</Link>
                                <span className="text-muted">|</span>
                                <Link to='/active' className="btn">Active</Link>
                            </div>
                        ) : (
                            <div style={{paddingLeft: '12px'}}>
                                <span className="me-3">Hello <b>{customer?.name || 'User'}</b></span>
                                <span className="text-muted">|</span>
                                <Link to='/home' className="btn" onClick={() => this.lnkLogoutClick()}>Logout</Link>
                                <span className="text-muted">|</span>
                                <Link to='/myprofile' className="btn">My Profile</Link>
                                <span className="text-muted">|</span>
                                <Link to='/cart' className="btn">
                                    My Cart ({totalItems} item{totalItems !== 1 ? 's' : ''})
                                </Link>
                                <span className="text-muted">|</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Event-handlers
    lnkLogoutClick() {
        this.context.setToken('');
        this.context.setUsername('');
        this.context.setCustomer(null);
        this.context.setCart([]); // Optional: clear cart on logout
    }
}

export default Inform;
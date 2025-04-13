import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Link } from 'react-router-dom';

class Inform extends Component {
    static contextType = MyContext;

    render() {
        const { token, customer, mycart } = this.context;
        const totalItems = mycart ? mycart.length : 0; // Unique items

        console.log("Inform.js customer:", customer); // Debug

        return (
            <div className="container-fluid bg-light py-0 border-bottom w-100" style={{ marginTop: '56px' }}>
                <div className="row align-items-center">
                    <div className="col-md-8 text-start">
                        {token === '' ? (
                            <div>
                                <Link to='/register' className="btn">Register</Link>
                                <span className="text-muted">|</span>
                                <Link to='/login' className="btn">Login</Link>
                                <span className="text-muted">|</span>
                                <Link to='/activate' className="btn">Active</Link>
                            </div>
                        ) : (
                            <div style={{ paddingLeft: '12px' }}>
                                <span className="me-3">Hello <b>{customer?.name || 'User'}</b></span>
                                <span className="text-muted">|</span>
                                <Link to='/home' className="btn" onClick={() => this.lnkLogoutClick()}>Logout</Link>
                                <span className="text-muted">|</span>
                                <Link to='/profile' className="btn">My Profile</Link>
                                <span className="text-muted">|</span>
                                <Link to='/cart' className="btn">
                                    My Cart ({totalItems} item{totalItems !== 1 ? 's' : ''})
                                </Link>
                                <span className="text-muted">|</span>
                                <Link to='/orders' className="btn">My Order</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    lnkLogoutClick() {
        this.context.setToken('');
        this.context.setUsername('');
        this.context.setCustomer(null);
        this.context.clearCart();
    }
}

export default Inform;
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Link } from 'react-router-dom';

class Inform extends Component {
    static contextType = MyContext;

    render() {
        const { token, customer, mycart } = this.context;
        const totalItems = mycart ? mycart.length : 0;

        console.log("Inform.js customer:", customer);

        return (
            <div className="customer-inform">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-8 d-flex align-items-center">
                            {token === '' ? (
                                <div className="d-flex align-items-center">
                                    <Link to='/register' className="btn btn-link">Register</Link>
                                    <span className="separator">|</span>
                                    <Link to='/login' className="btn btn-link">Login</Link>
                                    <span className="separator">|</span>
                                    <Link to='/activate' className="btn btn-link">Activate</Link>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center flex-wrap">
                                    <span className="greeting me-3">
                                        Hello <b>{customer?.name || 'User'}</b>
                                    </span>
                                    <span className="separator">|</span>
                                    <Link to='/home' className="btn btn-link" onClick={() => this.lnkLogoutClick()}>
                                        Logout
                                    </Link>
                                    <span className="separator">|</span>
                                    <Link to='/profile' className="btn btn-link">My Profile</Link>
                                    <span className="separator">|</span>
                                    <Link to='/orders' className="btn btn-link">My Orders</Link>
                                    <span className="separator">|</span>
                                    <Link to='/cart' className="btn btn-primary">
                                        My Cart ({totalItems} item{totalItems !== 1 ? 's' : ''})
                                    </Link>
                                </div>
                            )}
                        </div>
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
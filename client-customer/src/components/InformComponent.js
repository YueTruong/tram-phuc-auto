import React, {Component} from 'react';
import MyContext from '../contexts/MyContext';
import {Link} from 'react-router-dom';

class Inform extends Component {
    static contextType = MyContext; //Using this.context to access global state
    render() {
        return (
            <div className="container-fluid bg-light py-0 border-bottom w-100" style={{ marginTop: '56px' }}>
                <div className="row align-items-center">
                    <div className="col-md-8 text-start">
                        {this.context.token === '' ? (
                            <div>
                                <Link to='/register' className="btn">Register</Link>
                                <span className="text-muted">|</span>
                                <Link to='/login' className="btn">Login</Link>
                                <span className="text-muted">|</span>
                                <Link to='/active' className="btn">Active</Link>
                            </div>
                        ) : (
                            <div>
                                <span className="me-3">Hello <b>{this.context.customer?.name || 'User'}</b></span>
                                <span className="text-muted">|</span>
                                <Link to='/home' className="btn" onClick={() => this.lnkLogoutClick()}>Logout</Link>
                                <span className="text-muted">|</span>
                                <Link to='/myprofile' className="btn">My Profile</Link>
                                <span className="text-muted">|</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    //Event-handlers
    lnkLogoutClick() {
        this.context.setToken('');
        this.context.setUsername('');
        this.context.setCustomer(null);
    }
}

export default Inform;
import React, {Component} from 'react';
import MyContext from '../contexts/MyContext';
import {Link} from 'react-router-dom';

class Menu extends Component {
    static contextType = MyContext; //Using this.context to access global state
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link className="navbar-brand" to="/admin/home">TPV Auto</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item"><Link className="nav-link" to="/admin/home">Home</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/admin/category">Category</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/admin/product">Product</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/admin/order">Order</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/admin/customer">Customer</Link></li>
                        </ul>
                        <span className="navbar-text">
                            Hello <b>{this.context.username}</b> | 
                            <Link className="nav-link d-inline text-danger" to="/admin/home" onClick={() => this.lnkLogoutClick()}>Logout</Link>
                        </span>
                    </div>
                </div>
            </nav>
        );
    }
    
    //Event-handlers
    lnkLogoutClick() {
        this.context.setToken('');
        this.context.setUsername('');
    }
}

export default Menu;
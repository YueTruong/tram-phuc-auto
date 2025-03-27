import React, { Component } from "react";
import { Link } from "react-router-dom";
import MyContext from "../contexts/MyContext";
import axios from "axios";

class Inform extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props);
        this.state = {
            customer: null,
            showCart: false,
        };
    }

    componentDidMount() {
        this.fetchCustomer();
        window.addEventListener("customerUpdated", this.fetchCustomer);
    }

    componentWillUnmount() {
        window.removeEventListener("customerUpdated", this.fetchCustomer);
    }

    fetchCustomer = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const res = await axios.get("/api/customer/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                this.setState({ customer: res.data });
            } catch (error) {
                console.error("Error fetching customer:", error);
            }
        }
    };

    handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("customer");
        this.setState({ customer: null });
        window.location.href = "/";
    };

    toggleCartPreview = (show) => {
        this.setState({ showCart: show });
    };

    render() {
        const { cart = [] } = this.context || {}; // Đảm bảo cart luôn có giá trị mặc định
    
        return (
            <div className="border-bottom bg-light py-2 shadow-sm">
                <div className="container d-flex justify-content-between align-items-center">
                    <div>
                        <Link to="/register" className="text-decoration-none me-3 text-dark">Sign-up</Link>
                        <Link to="/login" className="text-decoration-none me-3 text-dark">Login</Link>
                        <Link to="/activate" className="text-decoration-none text-dark">Activate</Link>
                    </div>
                    <div className="position-relative">
                        <Link to="/cart" className="text-decoration-none text-dark">
                            My cart ({cart.length} items)
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Inform;
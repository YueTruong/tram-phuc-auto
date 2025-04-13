import React, { Component } from "react";
import axios from "axios";
import MyContext from "../contexts/MyContext";

class Profile extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props);
        this.state = {
            customer: null,
            loading: false,
            message: "",
        };
    }

    componentDidMount() {
        if (this.context.customer) {
            this.setState({ customer: this.context.customer });
        } else {
            this.fetchProfile();
        }
    }

    fetchProfile = async () => {
        const { token } = this.context;
        if (!token) {
            this.setState({ message: "Please login" });
            return;
        }
        this.setState({ loading: true });
        try {
            const response = await axios.get("/api/customer/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Profile fetch response:", response.data);
            this.setState({ customer: response.data, loading: false });
        } catch (error) {
            console.error("Profile fetch error:", error.response?.data || error.message);
            this.setState({ 
                message: error.response?.data?.message || "Failed to fetch profile", 
                loading: false 
            });
        }
    };

    render() {
        const { customer, loading, message } = this.state;
        return (
            <div className="container mt-5">
                <h2 className="mb-4 text-center text-primary">My Profile</h2>

                {message && (
                    <div className="alert alert-warning text-center">{message}</div>
                )}

                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : customer ? (
                    <div className="card shadow mx-auto" style={{ maxWidth: "400px" }}>
                        <div className="card-body">
                            <h5 className="card-title text-center text-success mb-3">
                                Welcome, {customer.name || customer.username}!
                            </h5>
                            <ul className="list-group list-group-flush mb-3">
                                <li className="list-group-item">
                                    <strong>Username:</strong> {customer.username}
                                </li>
                                <li className="list-group-item">
                                    <strong>Name:</strong> {customer.name || "N/A"}
                                </li>
                                <li className="list-group-item">
                                    <strong>Email:</strong> {customer.email}
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-muted">No profile data available.</p>
                )}
            </div>
        );
    }
}

export default Profile;
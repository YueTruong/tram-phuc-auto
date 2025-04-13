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
        // Use context customer if available
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
            console.log("Profile fetch response:", response.data); // Debug
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
            <div className="container mt-4">
                <h2>Profile</h2>
                {message && <div className="alert alert-info">{message}</div>}
                {loading ? (
                    <p>Loading...</p>
                ) : customer ? (
                    <div>
                        <p>Username: {customer.username}</p>
                        <p>Name: {customer.name}</p>
                        <p>Email: {customer.email}</p>
                    </div>
                ) : (
                    <p>No profile data</p>
                )}
            </div>
        );
    }
}

export default Profile;
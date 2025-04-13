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
        this.fetchProfile();
    }

    fetchProfile = async () => {
        const { token } = this.context;
        if (!token) {
            this.setState({ message: "Please login" });
            return;
        }
        this.setState({ loading: true });
        try {
            const response = await axios.get(`/api/customer/profile/${this.context.customerId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            this.setState({ customer: response.data, loading: false });
        } catch (error) {
            this.setState({ message: error.response?.data?.message || "Failed to fetch profile", loading: false });
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
import axios from "axios";
import React, { Component } from "react";
import withRouter from "../utils/withRouter";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            name: "",
            phone: "",
            email: "",
            message: "",
            success: false,
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password, name, phone, email } = this.state;
        console.log("Submitting registration:", { username, email }); // Debug
        try {
            const res = await axios.post("/api/customer/register", {
                username,
                password,
                name,
                phone,
                email,
            });
            console.log("Register response:", res.data); // Debug
            this.setState({ 
                message: res.data.message, 
                success: res.data.success,
                username: "",
                password: "",
                name: "",
                phone: "",
                email: ""
            });
        } catch (error) {
            console.error("Register error:", error.response?.data || error.message);
            this.setState({ 
                message: error.response?.data?.message || "Registration failed",
                success: false
            });
        }
    };

    render() {
        const { message, success } = this.state;
        return (
            <div className="container mt-5">
                <h2>Register</h2>
                {message && (
                    <p className={success ? "text-success" : "text-danger"}>
                        {message}
                    </p>
                )}
                <form onSubmit={this.handleSubmit}>
                    <input
                        className="form-control mb-2"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={this.state.username}
                        onChange={this.handleChange}
                        required
                    />
                    <input
                        className="form-control mb-2"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        required
                    />
                    <input
                        className="form-control mb-2"
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={this.state.name}
                        onChange={this.handleChange}
                    />
                    <input
                        className="form-control mb-2"
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={this.state.phone}
                        onChange={this.handleChange}
                    />
                    <input
                        className="form-control mb-2"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        required
                    />
                    <button className="btn btn-primary" type="submit">
                        Register
                    </button>
                </form>
            </div>
        );
    }
}

export default withRouter(Register);
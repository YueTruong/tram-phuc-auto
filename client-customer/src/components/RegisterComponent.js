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
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px', borderRadius: '15px' }}>
                    <h2 className="text-center mb-4">Register</h2>
                    {message && (
                        <div className={`alert ${success ? 'alert-success' : 'alert-danger'}`} role="alert">
                            {message}
                        </div>
                    )}
                    <form onSubmit={this.handleSubmit}>
                        <div className="mb-3">
                            <input
                                className="form-control"
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={this.state.username}
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                className="form-control"
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                className="form-control"
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={this.state.name}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                className="form-control"
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                value={this.state.phone}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                className="form-control"
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={this.state.email}
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <button className="btn btn-primary w-100" type="submit">
                            Register
                        </button>
                    </form>
                </div>
            </div>
        );
    }    
}

export default withRouter(Register);
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
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/customer/register", this.state);
            this.setState({ message: res.data.message });
        } catch (error) {
            this.setState({ message: error.response?.data?.message || "Signup failed" });
        }
    };

    render() {
        return (
            <div className="container mt-5">
                <h2>Register</h2>
                {this.state.message && <p className="text-danger">{this.state.message}</p>}
                <form onSubmit={this.handleSubmit}>
                    <input className="form-control mb-2" type="text" name="username" placeholder="Username" onChange={this.handleChange} required />
                    <input className="form-control mb-2" type="password" name="password" placeholder="Password" onChange={this.handleChange} required />
                    <input className="form-control mb-2" type="text" name="name" placeholder="Full Name" onChange={this.handleChange} />
                    <input className="form-control mb-2" type="text" name="phone" placeholder="Phone" onChange={this.handleChange} />
                    <input className="form-control mb-2" type="email" name="email" placeholder="Email" onChange={this.handleChange} required />
                    <button className="btn btn-primary" type="submit">Register</button>
                </form>
            </div>
        );
    }
}

export default withRouter(Register);
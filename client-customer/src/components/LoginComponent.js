import axios from "axios";
import React, { Component } from "react";
import withRouter from "../utils/withRouter";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            message: "",
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/customer/login", this.state);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("customer", JSON.stringify(res.data.customer));
            
            // Gửi sự kiện cập nhật customer
            window.dispatchEvent(new Event("customerUpdated"));
    
            this.props.navigate("/"); // Redirect to home
        } catch (error) {
            this.setState({ message: error.response?.data?.message || "Login failed" });
        }
    };    

    render() {
        return (
            <div className="container mt-5">
                <h2>Login</h2>
                {this.state.message && <p className="text-danger">{this.state.message}</p>}
                <form onSubmit={this.handleSubmit}>
                    <input className="form-control mb-2" type="text" name="username" placeholder="Username" onChange={this.handleChange} required />
                    <input className="form-control mb-2" type="password" name="password" placeholder="Password" onChange={this.handleChange} required />
                    <button className="btn btn-success" type="submit">Login</button>
                </form>
            </div>
        );
    }
}

export default withRouter(Login);
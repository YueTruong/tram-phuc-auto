import axios from "axios";
import React, { Component } from "react";
import withRouter from "../utils/withRouter";

class Activate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: "",
            token: "",
            message: "",
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/customer/activate", this.state);
            this.setState({ message: res.data.message });
        } catch (error) {
            this.setState({ message: error.response?.data?.message || "Activation failed" });
        }
    };

    render() {
        return (
            <div className="container mt-5">
                <h2>Activate Account</h2>
                {this.state.message && <p className="text-danger">{this.state.message}</p>}
                <form onSubmit={this.handleSubmit}>
                    <input className="form-control mb-2" type="text" name="_id" placeholder="Customer ID" onChange={this.handleChange} required />
                    <input className="form-control mb-2" type="text" name="token" placeholder="Activation Token" onChange={this.handleChange} required />
                    <button className="btn btn-warning" type="submit">Activate</button>
                </form>
            </div>
        );
    }
}

export default withRouter(Activate);
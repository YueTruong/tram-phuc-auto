import axios from "axios";
import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import withRouter from "../utils/withRouter";
import Home from "./HomeComponent";

class Login extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props);
        this.state = {
            txtUsername: '',
            txtPassword: '',
            message: '',
        };
    }

    render() {
        if (this.context.token === '') {
            return (
                <div className="container mt-5">
                    <h2>Login</h2>
                    {this.state.message && <p className="text-danger">{this.state.message}</p>}
                    <form>
                        <input
                            className="form-control mb-2"
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={this.state.txtUsername}
                            onChange={(e) => this.setState({ txtUsername: e.target.value })}
                            required
                        />
                        <input
                            className="form-control mb-2"
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={this.state.txtPassword}
                            onChange={(e) => this.setState({ txtPassword: e.target.value })}
                            required
                        />
                        <button className="btn btn-success" onClick={(e) => this.btnLoginClick(e)}>Login</button>
                    </form>
                </div>
            );
        }
        return (<Home />);
    }

    btnLoginClick(e) {
        e.preventDefault();
        const username = this.state.txtUsername;
        const password = this.state.txtPassword;
        if (username && password) {
            const account = { username: username, password: password };
            this.apiLogin(account);
        } else {
            this.setState({ message: 'Please input username and password' });
        }
    }

    apiLogin(account) {
        axios.post('/api/customer/login', account).then((res) => {
            const result = res.data;
            if (result.success === true) {
                console.log("Login response:", result); // Debug
                this.context.setToken(result.token);
                this.context.setUsername(result.customer.username);
                this.context.setCustomer(result.customer);
                this.props.navigate('/home');
            } else {
                this.setState({ message: result.message });
            }
        }).catch((error) => {
            console.error("Login error:", error);
            this.setState({ message: 'Login failed: ' + error.message });
        });
    }
}

export default withRouter(Login);
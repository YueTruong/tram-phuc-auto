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
                <div className="container d-flex justify-content-center align-items-center vh-100">
                    <div className="card p-4 shadow-lg" style={{ width: '100%', maxWidth: '400px', borderRadius: '15px' }}>
                        <h2 className="text-center text-primary mb-4">Customer Login</h2>
                        {this.state.message && (
                            <div className="alert alert-danger text-center p-2" role="alert">
                                {this.state.message}
                            </div>
                        )}
                        <form>
                            <div className="mb-3">
                                <input
                                    className="form-control form-control-lg"
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={this.state.txtUsername}
                                    onChange={(e) => this.setState({ txtUsername: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    className="form-control form-control-lg"
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={this.state.txtPassword}
                                    onChange={(e) => this.setState({ txtPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="d-grid mb-3">
                                <button
                                    className="btn btn-success btn-lg"
                                    onClick={(e) => this.btnLoginClick(e)}
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                        <p className="text-center mt-3 text-muted" style={{ fontSize: '0.9rem' }}>
                            Don't have an account? <a href="/register" className="text-decoration-none text-primary">Register</a>
                        </p>
                    </div>
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
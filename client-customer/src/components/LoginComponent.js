import axios from "axios";
import React, {Component} from "react";
import MyContext from "../contexts/MyContext";
import withRouter from "../utils/withRouter";
import Home from "./HomeComponent";

class Login extends Component {
    static contextType = MyContext; //Using this.context to access global state
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
        return (<Home />); // Or redirect elsewhere if needed
    }

    //Event handlers
    btnLoginClick(e) {
        e.preventDefault();
        const username = this.state.txtUsername;
        const password = this.state.txtPassword;
        if (username && password) {
            const account = {username: username, password: password};
            this.apiLogin(account);
        } else {
            alert('Please input username and password');
        }
    }

    //APIs
    apiLogin(account) {
        axios.post('/api/customer/login', account).then((res) => {
            const result = res.data;
            if (result.success === true) {
                this.context.setToken(result.token);
                this.context.setUsername(account.username);
                this.props.navigate('/home'); // ✅ This will now work
            } else {
                alert(result.message);
            }
        });
    }
}

export default withRouter(Login);
import axios from 'axios';
import React, {Component} from 'react';
import MyContext from '../contexts/MyContext';

class Login extends Component {
    static contextType = MyContext; //Using this.context to access global state
    constructor(props) {
        super(props);
        this.state = {
            txtUsername: '',
            txtPassword: ''
        };
    }
    render() {
        if (this.context.token === '') {
            return (
                <div className='d-flex justify-content-center align-items-center vh-100'>
                    <div className='card p-4 shadow-sm' style={{ width: '400px' }}>
                        <h2 className='text-center mb-4'>ADMIN LOGIN</h2>
                        <form>
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input
                                    className='form-control'
                                    type='text'
                                    value={this.state.txtUsername}
                                    onChange={(e) => {this.setState({txtUsername: e.target.value})}}
                                />
                            </div>
                            <div>
                                <label className='form-label'>Password</label>
                                <input
                                    className='form-control'
                                    type='password'
                                    value={this.state.txtPassword}
                                    onChange={(e) => {this.setState({txtPassword: e.target.value})}}
                                />
                            </div>
                            <button className='btn btn-primary w-100' onClick={(e) => this.btnLoginClick(e)}>LOGIN</button>
                        </form>
                    </div>
                </div>
            );
        }
        return (<div />);
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
        axios.post('/api/admin/login', account).then((res) => {
            const result = res.data;
            if (result.success === true) {
                this.context.setToken(result.token);
                this.context.setUsername(account.username);
            } else {
                alert(result.message);
            }
        });
    }
}

export default Login;
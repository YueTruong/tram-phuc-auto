import React, { Component } from 'react';
import MyContext from './MyContext';

class MyProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Global state
            token: localStorage.getItem("token") || '',
            username: '',
            // Functions
            setToken: this.setToken,
            setUsername: this.setUsername
        };
    }

    setToken = (value) => {
        console.log("Setting token:", value); // Debug
        this.setState({ token: value });
        if (value) {
            localStorage.setItem("token", value);
        } else {
            localStorage.removeItem("token");
        }
    };

    setUsername = (value) => {
        console.log("Setting username:", value); // Debug
        this.setState({ username: value });
    };

    componentDidMount() {
        // Verify token on mount (optional)
        const token = this.state.token;
        if (token) {
            console.log("Initial token loaded:", token);
        }
    }

    render() {
        return (
            <MyContext.Provider value={this.state}>
                {this.props.children}
            </MyContext.Provider>
        );
    }
}

export default MyProvider;
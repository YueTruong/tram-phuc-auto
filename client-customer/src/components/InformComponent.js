import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Inform extends Component {
    render() {
        return (
            <div className="border-bottom bg-light py-2 shadow-sm">
                <div className="container d-flex justify-content-between align-items-center">
                    {/* Left Side */}
                    <div>
                        <Link to='/register' className="text-decoration-none me-3 text-dark">Sign-up</Link>
                        <Link to='/login' className="text-decoration-none me-3 text-dark">Login</Link>
                        <Link to='/activate' className="text-decoration-none text-dark">Active</Link>
                    </div>

                    {/* Right Side */}
                    <div>
                        <Link to='' className="text-decoration-none text-dark">My cart</Link> have <b>0</b> items
                    </div>
                </div>
            </div>
        );
    }
}

export default Inform;
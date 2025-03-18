import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Inform extends Component {
    render() {
        return (
            <div className="border-bottom">
                <div className="float-left">
                    <Link to=''>Login</Link> | <Link to=''>Sign-up</Link> | <Link to=''>Active</Link>
                </div>
                <div className="float-right">
                    <Link to=''>My cart</Link> have <b>0</b> items
                </div>
                <div className="float-clear" />
            </div>
        );
    }
}

export default Inform;
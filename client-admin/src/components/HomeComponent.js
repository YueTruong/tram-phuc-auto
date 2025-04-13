import React, {Component} from 'react';
import logoImg from '../assets/logo.png';

class Home extends Component {
    render() {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
                <h2 className="mb-4">ADMIN HOME</h2>
                <div className='shadow-lg p-4 rounded bg-white'>
                    <img src={logoImg} width="800px" height="800px" alt="" />
                </div>
            </div>
        );
    }
}

export default Home;
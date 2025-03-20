import axios from 'axios';
import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newprods: [],
            hotprods: []
        };
    }
    render() {
        const newprods = this.state.newprods.map((item) => {
            return (
                <div key={item._id} className="col-md-4 mb-4">
                    <div className="card shadow-sm">
                        <Link to={'/product/' + item._id}>
                            <img src={"data:image/jpg;base64," + item.image} className="card-img-top" alt={item.name} />
                        </Link>
                        <div className="card-body text-center">
                            <h5 className="card-title">{item.name}</h5>
                            <p className="card-text text-danger fw-bold">Price: ${item.price}</p>
                        </div>
                    </div>
                </div>
            );
        });
        const hotprods = this.state.hotprods.map((item) => {
            return (
                <div key={item._id} className="col-md-4 mb-4">
                    <div className="card shadow-sm">
                        <Link to={'/product/' + item._id}>
                            <img src={"data:image/jpg;base64," + item.image} className="card-img-top" alt={item.name} />
                        </Link>
                        <div className="card-body text-center">
                            <h5 className="card-title">{item.name}</h5>
                            <p className="card-text text-danger fw-bold">Price: ${item.price}</p>
                        </div>
                    </div>
                </div>
            );
        });
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <h2 className="mb-4 text-primary">NEW PRODUCTS</h2>
                </div>
                <div className="row">
                    {newprods}
                </div>

                {this.state.hotprods.length > 0 && (
                    <>
                        <div className="text-center">
                            <h2 className="mt-5 mb-4 text-warning">HOT PRODUCTS</h2>
                        </div>
                        <div className="row">
                            {hotprods}
                        </div>
                    </>
                )}
            </div>
        );
    }

    componentDidMount() {
        this.apiGetNewProducts();
        this.apiGetHotProducts();
    }

    //APIs
    apiGetNewProducts() {
        axios.get('/api/customer/products/new').then((res) => {
            const result = res.data;
            this.setState({ newprods: result });
        });
    }

    apiGetHotProducts() {
        axios.get('/api/customer/products/hot').then((res) => {
            const result = res.data;
            this.setState({ hotprods: result });
        });
    }
}

export default Home;
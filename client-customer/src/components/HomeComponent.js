import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newProds: [],
            hotProds: [],
            loading: true,
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        await this.fetchNewProducts();
        await this.fetchHotProducts();
        this.setState({ loading: false });
    };

    fetchNewProducts = async () => {
        try {
            const res = await axios.get('/api/customer/products/new');
            this.setState({ newProds: res.data });
        } catch (error) {
            console.error("❌ Error fetching new products:", error);
        }
    };

    fetchHotProducts = async () => {
        try {
            const res = await axios.get('/api/customer/products/hot');
            this.setState({ hotProds: res.data });
        } catch (error) {
            console.error("❌ Error fetching hot products:", error);
        }
    };

    render() {
        const { newProds, hotProds, loading } = this.state;

        if (loading) {
            return (
                <div className="container mt-5 text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Fetching products...</p>
                </div>
            );
        }

        return (
            <div className="container mt-4">
                {/* New Products Section */}
                <div className="text-center">
                    <h2 className="mb-4 text-primary">NEW PRODUCTS</h2>
                </div>
                <div className="row">
                    {newProds.map((item) => (
                        <div key={item._id} className="col-md-4 mb-4">
                            <div className="card shadow-sm">
                                <Link to={`/product/${item._id}`}>
                                    <img src={`data:image/jpg;base64,${item.image}`} className="card-img-top" alt={item.name} />
                                </Link>
                                <div className="card-body text-center">
                                    <h5 className="card-title">{item.name}</h5>
                                    <p className="card-text text-danger fw-bold">Price: ${item.price}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Hot Products Section */}
                {hotProds.length > 0 && (
                    <>
                        <div className="text-center">
                            <h2 className="mt-5 mb-4 text-warning">HOT PRODUCTS</h2>
                        </div>
                        <div className="row">
                            {hotProds.map((item) => (
                                <div key={item._id} className="col-md-4 mb-4">
                                    <div className="card shadow-sm">
                                        <Link to={`/product/${item._id}`}>
                                            <img src={`data:image/jpg;base64,${item.image}`} className="card-img-top" alt={item.name} />
                                        </Link>
                                        <div className="card-body text-center">
                                            <h5 className="card-title">{item.name}</h5>
                                            <p className="card-text text-danger fw-bold">Price: ${item.price}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    }
}

export default Home;
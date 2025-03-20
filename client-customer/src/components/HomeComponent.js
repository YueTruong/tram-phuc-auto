import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [newProds, setNewProds] = useState([]);
    const [hotProds, setHotProds] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch New Products
    const fetchNewProducts = useCallback(async () => {
        try {
            const res = await axios.get('/api/customer/products/new');
            setNewProds(res.data);
        } catch (error) {
            console.error("❌ Error fetching new products:", error);
        }
    }, []);

    // Fetch Hot Products
    const fetchHotProducts = useCallback(async () => {
        try {
            const res = await axios.get('/api/customer/products/hot');
            setHotProds(res.data);
        } catch (error) {
            console.error("❌ Error fetching hot products:", error);
        }
    }, []);

    // Fetch data on mount
    useEffect(() => {
        const fetchData = async () => {
            await fetchNewProducts();
            await fetchHotProducts();
            setLoading(false);
        };
        fetchData();
    }, [fetchNewProducts, fetchHotProducts]);

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
};

export default Home;
import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import withRouter from "../utils/withRouter";

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
        };
    }

    componentDidMount() {
        this.loadProducts();
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.params.cid !== prevProps.params.cid ||
            this.props.params.keyword !== prevProps.params.keyword
        ) {
            this.loadProducts();
        }
    }

    loadProducts = () => {
        const { cid, keyword } = this.props.params;
        if (cid) {
            this.apiGetProductsByCatID(cid);
        } else if (keyword) {
            this.apiGetProductsByKeyword(keyword);
        }
    };

    // API Calls
    apiGetProductsByCatID = async (cid) => {
        try {
            const res = await axios.get(`/api/customer/products/category/${cid}`);
            this.setState({ products: res.data });
        } catch (error) {
            console.error("Error fetching category products:", error);
        }
    };

    apiGetProductsByKeyword = async (keyword) => {
        try {
            const res = await axios.get(`/api/customer/products/search/${keyword}`);
            this.setState({ products: res.data });
        } catch (error) {
            console.error("Error fetching search products:", error);
        }
    };

    render() {
        return (
            <div className="container mt-4">
                <h2 className="text-center mb-4 text-primary font">LIST PRODUCTS</h2>
                <div className="row">
                    {this.state.products.length > 0 ? (
                        this.state.products.map((item) => (
                            <div key={item._id} className="col-md-4 mb-4">
                                <div className="card shadow-sm">
                                    <Link to={`/product/${item._id}`}>
                                        <img
                                            src={`data:image/jpg;base64,${item.image}`}
                                            className="card-img-top"
                                            alt={item.name}
                                        />
                                    </Link>
                                    <div className="card-body text-center">
                                        <h5 className="card-title">{item.name}</h5>
                                        <p className="card-text fw-bold text-primary">
                                            Price: ${item.price}
                                        </p>
                                        <Link
                                            to={`/product/${item._id}`}
                                            className="btn btn-outline-primary"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted">No products found.</p>
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(Product);
import axios from 'axios';
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import withRouter from '../utils/withRouter';

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        };
    }
    render() {
        return (
            <div className="container mt-4">
                <h2 className="text-center mb-4">LIST PRODUCTS</h2>
                <div className="row">
                    {this.state.products.map((item) => (
                        <div key={item._id} className="col-md-4 mb-4">
                            <div className="card shadow-sm">
                                <Link to={'/product/' + item._id}>
                                    <img 
                                        src={"data:image/jpg;base64," + item.image} 
                                        className="card-img-top" 
                                        alt={item.name} 
                                    />
                                </Link>
                                <div className="card-body text-center">
                                    <h5 className="card-title">{item.name}</h5>
                                    <p className="card-text fw-bold text-primary">Price: ${item.price}</p>
                                    <Link to={'/product/' + item._id} className="btn btn-outline-primary">View Details</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    componentDidMount() { // first: /product/...
        const params = this.props.params;
        if (params.cid) {
            this.apiGetProductsByCatID(params.cid);
        } else if (params.keyword) {
            this.apiGetProductsByKeyword(params.keyword);
        }
    }
    
    componentDidUpdate(prevProps) { // changed: /product/...
        const params = this.props.params;
        if (params.cid && params.cid !== prevProps.params.cid) {
            this.apiGetProductsByCatID(params.cid);
        } else if (params.keyword && params.keyword !== prevProps.params.keyword) {
            this.apiGetProductsByKeyword(params.keyword);
        }
    }

    //APIs
    apiGetProductsByCatID(cid) {
        axios.get('/api/customer/products/category/' + cid).then((res) => {
            const result = res.data;
            this.setState({products: result});
        });
    }

    apiGetProductsByKeyword(keyword) {
        axios.get('/api/customer/products/search/' + keyword).then((res) => {
            const result = res.data;
            this.setState({ products: result });
        });
    }
}

export default withRouter(Product);
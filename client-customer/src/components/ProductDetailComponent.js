import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';

class ProductDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: null
        };
    }
    render() {
        const prod = this.state.product;
        if (!prod) {
            return <div className="text-center mt-5"><h4>Loading product details...</h4></div>;
        }

        return (
            <div className="container mt-4">
                <h2 className="text-center mb-4">PRODUCT DETAILS</h2>
                <div className="row">
                    <div className="col-md-6 text-center">
                        <img 
                            src={"data:image/jpg;base64," + prod.image} 
                            className="img-fluid rounded shadow"
                            alt={prod.name} 
                        />
                    </div>
                    <div className="col-md-6">
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <th>ID:</th>
                                    <td>{prod._id}</td>
                                </tr>
                                <tr>
                                    <th>Name:</th>
                                    <td>{prod.name}</td>
                                </tr>
                                <tr>
                                    <th>Price:</th>
                                    <td className="text-primary fw-bold">${prod.price}</td>
                                </tr>
                                <tr>
                                    <th>Category:</th>
                                    <td>{prod.category.name}</td>
                                </tr>
                                <tr>
                                    <th>Quantity:</th>
                                    <td>
                                        <input type="number" min="1" max="99" className="form-control w-50" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button className="btn btn-primary w-100 mt-3">ADD TO CART</button>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        const params = this.props.params;
        this.apiGetProduct(params.id);
    }

    //APIs
    apiGetProduct(id) {
        axios.get('/api/customer/products/' + id).then((res) => {
            const result = res.data;
            this.setState({ product: result });
        });
    }
}

export default withRouter(ProductDetail);
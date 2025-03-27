import axios from "axios";
import React, { Component } from "react";
import withRouter from "../utils/withRouter";
import MyContext from "../contexts/MyContext";

class ProductDetail extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props);
        this.state = {
            product: null,
            quantity: 1,
        };
    }

    componentDidMount() {
        this.apiGetProduct(this.props.params.id);
    }

    apiGetProduct = async (id) => {
        try {
            const res = await axios.get(`/api/customer/products/${id}`);
            this.setState({ product: res.data });
        } catch (error) {
            console.error("Error fetching product details:", error);
            this.setState({ product: "error" });
        }
    };

    handleQuantityChange = (event) => {
        this.setState({ quantity: parseInt(event.target.value, 10) || 1 });
    };

    addToCart = () => {
        const { product, quantity } = this.state;
        const { addToCart } = this.context; // Get addToCart from context

        if (!product) return;

        addToCart(product, quantity);
        alert(`${quantity} of ${product.name} added to cart!`);
    };

    render() {
        const { product, quantity } = this.state;

        if (!product) {
            return <div className="text-center mt-5"><h4>Loading product details...</h4></div>;
        }

        if (product === "error") {
            return <div className="text-center mt-5 text-danger"><h4>Product not found!</h4></div>;
        }

        return (
            <div className="container mt-4">
                <h2 className="text-center mb-4">PRODUCT DETAILS</h2>
                <div className="row">
                    <div className="col-md-6 text-center">
                        <img
                            src={`data:image/jpg;base64,${product.image}`}
                            className="img-fluid rounded shadow"
                            alt={product.name}
                        />
                    </div>
                    <div className="col-md-6">
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <th>ID:</th>
                                    <td>{product._id}</td>
                                </tr>
                                <tr>
                                    <th>Name:</th>
                                    <td>{product.name}</td>
                                </tr>
                                <tr>
                                    <th>Price:</th>
                                    <td className="text-primary fw-bold">${product.price}</td>
                                </tr>
                                <tr>
                                    <th>Category:</th>
                                    <td>{product.category?.name || "Unknown"}</td>
                                </tr>
                                <tr>
                                    <th>Quantity:</th>
                                    <td>
                                        <input
                                            type="number"
                                            min="1"
                                            max="99"
                                            className="form-control w-50"
                                            value={quantity}
                                            onChange={this.handleQuantityChange}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button className="btn btn-primary w-100 mt-3" onClick={this.addToCart}>
                            ADD TO CART
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ProductDetail);
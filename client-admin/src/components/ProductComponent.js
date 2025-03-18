import axios from 'axios';
import React, {Component} from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';

class Product extends Component {
    static contextType = MyContext; // using this.context to access global state
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            noPages: 0,
            curPage: 1,
            itemSelected: null
        };
    }
    render() {
        const prods = this.state.products.map((item) => {
            return (
                <tr key={item._id} onClick={() => this.trItemClick(item)}>
                    <td>{item._id}</td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{new Date(item.cdate).toLocaleString()}</td>
                    <td>{item.category.name}</td>
                    <td>
                        <img src={`data:image/jpg;base64,${item.image}`} className="img-thumbnail" width="100" alt="Product" />
                    </td>
                </tr>
            );
        });
        const pagination = Array.from({ length: this.state.noPages }, (_, index) => {
            if ((index + 1) === this.state.curPage) {
                return (<span key={index} className="fw-bold mx-2">| <b>{index + 1}</b> |</span>);
            } else {
                return (<span key={index} className="text-primary mx-2" style={{ cursor: 'pointer' }} onClick={() => this.lnkPageClick(index + 1)}>| {index + 1} |</span>);
            }
        });
        return (
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-8">
                        <h2 className="text-center">PRODUCT LIST</h2>
                        <table className="table table-striped table-bordered">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Creation Date</th>
                                    <th>Category</th>
                                    <th>Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prods}
                                <tr>
                                    <td colSpan="6" className="text-center">{pagination}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-4">
                        <ProductDetail item={this.state.itemSelected} curPage={this.state.curPage} updateProducts={this.updateProducts} />
                    </div>
                </div>
            </div>
        );
    }
    
    componentDidMount() {
        this.apiGetProducts(this.state.curPage);
    }
    
    updateProducts = (products, noPages) => { // arrow-function
        this.setState({products: products, noPages: noPages});
    }
    
    //Event handlers
    lnkPageClick(index) {
        this.apiGetProducts(index);
    }

    trItemClick(item) {
        this.setState({itemSelected: item});
    }

    //APIs
    apiGetProducts(page) {
        const config = {headers: {'x-access-token': this.context.token}};
        axios.get('/api/admin/products?page=' + page, config).then((res) => {
            const result = res.data;
            this.setState({products: result.products, noPages: result.noPages, curPage: result.curPage});
        });
    }
}

export default Product;
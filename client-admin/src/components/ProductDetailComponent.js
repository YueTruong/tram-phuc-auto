import axios from 'axios';
import React, {Component} from 'react';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
    static contextType = MyContext; //Using this.context to access global state
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            txtID: '',
            txtName: '',
            txtPrice: 0,
            cmbCategory: '',
            imgProduct: '',
        };
    }
    render() {
        const cates = this.state.categories.map((cate) => {
            if (this.props.item != null) {
                return (<option key={cate._id} value={cate._id} selected={cate._id === this.props.item.category._id}>{cate.name}</option>);
            } else {
                return (<option key={cate._id} value={cate._id}>{cate.name}</option>);
            }
        });
        return (
            <div className="float-right">
                <h2 className="text-center">PRODUCT DETAIL</h2>
                <form>
                    <div className="mb-3">
                        <label className="form-label">ID</label>
                        <input type="text" className="form-control" value={this.state.txtID} readOnly />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" value={this.state.txtName} onChange={(e) => this.setState({ txtName: e.target.value })} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Price</label>
                        <input type="number" className="form-control" value={this.state.txtPrice} onChange={(e) => this.setState({ txtPrice: e.target.value })} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Category</label>
                        <select className="form-select" onChange={(e) => this.setState({ cmbCategory: e.target.value })}>
                            {cates}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Image</label>
                        <input type="file" className="form-control" onChange={(e) => this.previewImage(e)} />
                    </div>
                    <div className="mb-3">
                        <button className="btn btn-success me-2" onClick={(e) => this.btnAddClick(e)}>ADD NEW</button>
                        <button className="btn btn-warning me-2" onClick={(e) => this.btnUpdateClick(e)}>UPDATE</button>
                        <button className="btn btn-danger" onClick={(e) => this.btnDeleteClick(e)}>DELETE</button>
                    </div>
                    <div className="mb-3">
                        <img src={this.state.imgProduct} className="img-thumbnail" width="300px" height="300px" alt="" />
                    </div>
                </form>
            </div>
        );
    }

    componentDidMount() {
        this.apiGetCategories();
    }

    componentDidUpdate(prevProps) {
        if (this.props.item !== prevProps.item) {
            this.setState({
                txtID: this.props.item._id,
                txtName: this.props.item.name,
                txtPrice: this.props.item.price,
                cmbCategory: this.props.item.category._id,
                imgProduct: 'data:image/jpg;base64,' + this.props.item.image
            });
        }
    }

    //Event-handlers
    previewImage(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                this.setState({imgProduct: evt.target.result});
            }
            reader.readAsDataURL(file);
        }
    }

    btnAddClick(e) {
        e.preventDefault();
        const name = this.state.txtName;
        const price = parseInt(this.state.txtPrice);
        const category = this.state.cmbCategory;
        const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, ''); // remove "data:image/...;base64,"
        if (name && price && category && image) {
            const prod = {name: name, price: price, category: category, image: image};
            this.apiPostProduct(prod);
        } else {
            alert('Please input name and price and category and image');
        }
    }

    btnUpdateClick(e) {
        e.preventDefault();
        const id = this.state.txtID;
        const name = this.state.txtName;
        const price = parseInt(this.state.txtPrice);
        const category = this.state.cmbCategory;
        const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, ''); // remove "data:image/...;base64,"
        if (id && name && price && category && image) {
            const prod = {name: name, price: price, category: category, image: image};
            this.apiPutProduct(id, prod);
        } else {
            alert('Please input id and name and price and category and image');
        }
    }

    btnDeleteClick(e) {
        e.preventDefault();
        if (window.confirm('ARE YOU SURE?')) {
            const id = this.state.txtID;
            if (id) {
                this.apiDeleteProduct(id);
            } else {
                alert('Please input id');
            }
        }
    }

    //APIs
    apiGetCategories() {
        const config = {headers: {'x-access-token': this.context.token}};
        axios.get('/api/admin/categories', config).then((res) => {
            const result = res.data;
            this.setState({ categories: result });
        });
    }

    apiPostProduct(prod) {
        const config = {headers: {'x-access-token': this.context.token}};
        axios.post('/api/admin/products', prod, config).then((res) => {
            const result = res.data;
            if (result) {
                alert('Thêm sản phẩm thành công!');
                this.apiGetProducts();
            } else {
                alert('Thêm sản phẩm thất bại!');
            }
        });
    }

    apiPutProduct(id, prod) {
        const config = {headers: {'x-access-token': this.context.token}};
        axios.put('/api/admin/products/' + id, prod, config).then((res) => {
            const result = res.data;
            if (result) {
                alert('Cập nhật sản phẩm thành công!');
                this.apiGetProducts();
            } else {
                alert('Cập nhật sản phẩm thất bại!');
            }
        });
    }

    apiDeleteProduct(id) {
        const config = {headers: { 'x-access-token': this.context.token}};
        axios.delete('/api/admin/products/' + id, config).then((res) => {
            const result = res.data;
            if (result) {
                alert('Xóa sản phẩm thành công!');
                this.apiGetProducts();
            } else {
                alert('Xóa sản phẩm thất bại!');
            }
        });
    }

    apiGetProducts() {
        const config = {headers: { 'x-access-token': this.context.token}};
        axios.get('/api/admin/products?page=' + this.props.curPage, config).then((res) => {
            const result = res.data;
            this.props.updateProducts(result.products, result.noPages);
            if (result.products.length !== 0) {
                this.props.updateProducts(result.products, result.noPages);
            } else {
                axios.get('/api/admin/products?pages=' + (this.props.curPage - 1), config).then((res) => {
                    const result = res.data;
                    this.props.updateProducts(result.products, result.noPages);
                });
            }
        });
    }
}

export default ProductDetail;
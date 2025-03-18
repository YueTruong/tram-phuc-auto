import axios from "axios";
import React, {Component} from 'react';
import MyContext from "../contexts/MyContext";

class CategoryDetail extends Component {
    static contextType = MyContext;
    constructor(props) {
        super(props);
        this.state = {
            txtID: '',
            txtName: ''
        };
    }
    render() {
        return (
            <div className="container mt-4">
                <h2 className="text-center text-primary mb-4">CATEGORY DETAIL</h2>
                <form className="border p-4 rounded shadow bg-light">
                    {/* ID Input */}
                    <div className="mb-3">
                        <label className="form-label">ID</label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.txtID}
                            onChange={(e) => this.setState({ txtID: e.target.value })}
                            readOnly
                        />
                    </div>

                    {/* Name Input */}
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.txtName}
                            onChange={(e) => this.setState({ txtName: e.target.value })}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-success" onClick={(e) => this.btnAddClick(e)}>ADD NEW</button>
                        <button className="btn btn-warning" onClick={(e) => this.btnUpdateClick(e)}>UPDATE</button>
                        <button className="btn btn-danger" onClick={(e) => this.btnDeleteClick(e)}>DELETE</button>
                    </div>
                </form>
            </div>
        );
    }

    componentDidUpdate(prevProps) {
        if (this.props.item !== prevProps.item) {
            this.setState({txtID: this.props.item._id, txtName: this.props.item.name});
        }
    }

    //Event handlers
    btnAddClick(e) {
        e.preventDefault();
        const name = this.state.txtName;
        if (name) {
            const cate = {name: name};
            this.apiPostCategory(cate);
        } else {
            alert('Please input name');
        }
    }

    btnUpdateClick(e) {
        e.preventDefault();
        const id = this.state.txtID;
        const name = this.state.txtName;
        if (id && name) {
            const cate = {name: name};
            this.apiPutCategory(id, cate);
        } else {
            alert('Please input id and name');
        }
    }

    btnDeleteClick(e) {
        e.preventDefault();
        if (window.confirm('ARE YOU SURE?')) {
            const id = this.state.txtID;
            if (id) {
                this.apiDeleteCategory(id);
            } else {
                alert('Please input id');
            }
        }
    }

    //APIs
    apiPostCategory(cate) {
        const config = {headers: {'x-access-token': this.context.token}};
        axios.post('/api/admin/categories', cate, config).then((res) => {
            const result = res.data;
            if (result) {
                alert('OK BABY!');
                this.apiGetCategories();
            } else {
                alert('SORRY BABY!');
            }
        });
    }

    apiGetCategories() {
        const config = {headers: {'x-access-token': this.context.token}};
        axios.get('/api/admin/categories', config).then((res) => {
            const result = res.data;
            this.props.updateCategories(result);
        });
    }

    apiPutCategory(id, cate) {
        const config = {headers: {'x-access-token': this.context.token}};
        axios.put('/api/admin/categories/' + id, cate, config).then((res) => {
            const result = res.data;
            if (result) {
                alert('OK BABY!');
                this.apiGetCategories();
            } else {
                alert('SORRY BABY!');
            }
        });
    }

    apiDeleteCategory(id) {
        const config = {headers: {'x-access-token': this.context.token}};
        axios.delete('/api/admin/categories/' + id, config).then((res) => {
            const result = res.data;
            if (result) {
                alert('OK BABY!');
                this.apiGetCategories();
            } else {
                alert('SORRY BABY!');
            }
        });
    }
}

export default CategoryDetail;
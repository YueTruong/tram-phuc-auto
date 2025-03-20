import axios from 'axios';
import React, {Component} from 'react';
import MyContext from '../contexts/MyContext';
import CategoryDetail from './CategoryDetailComponent';

class Category extends Component {
    static contextType = MyContext; //Using this.context to access global state
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            itemSelected: null
        };
    }
    render() {
        const cates = this.state.categories.map((item) => {
            return (
                <tr key={item._id} className="table-light" onClick={() => this.trItemClick(item)}>
                    <td>{item._id}</td>
                    <td>{item.name}</td>
                </tr>
            );
        });
        return (
            <div className="container mt-4">
                <h2 className="text-center text-primary mb-4">CATEGORY LIST</h2>
                <div className="row">
                    {/* Danh sách category */}
                    <div className="col-md-6">
                        <table className="table table-hover table-bordered">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>{cates}</tbody>
                        </table>
                    </div>

                    {/* Chi tiết category */}
                    <div className="col-md-6">
                        <CategoryDetail item={this.state.itemSelected} updateCategories={this.updateCategories} />
                    </div>
                </div>
            </div>
        );
    }

    updateCategories = (categories) => {
        this.setState({categories: categories});
    }

    componentDidMount() {
        this.apiGetCategories();
    }

    //Event handlers
    trItemClick(item) {
        this.setState({itemSelected: item});
    }

    //APIs
    apiGetCategories() {
        const config = {headers: {'x-access-token': this.context.token}};
        axios.get('/api/admin/categories', config).then((res) => {
            const result = res.data;
            this.setState({categories: result});
        });
    }
}

export default Category;
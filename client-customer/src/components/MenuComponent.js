import axios from 'axios';
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import withRouter from '../utils/withRouter';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            txtKeyword: ''
        };
    }
    render() {
        const cates = this.state.categories.map((item) => {
            return (
                <li key={item._id} className="nav-item">
                    <Link className="nav-link" to={'/product/category/' + item._id}>{item.name}</Link>
                </li>
            );
        });
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom shadow-sm">
                <div className="container">
                    <Link className="navbar-brand fw-bold" to="/">Trâm Phúc Auto</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            {cates}
                        </ul>

                        {/* Search Form */}
                        <form className="d-flex" onSubmit={(e) => this.btnSearchClick(e)}>
                            <input
                                className="form-control me-2"
                                type="search"
                                placeholder="Enter keyword"
                                aria-label="Search"
                                value={this.state.txtKeyword}
                                onChange={(e) => this.setState({ txtKeyword: e.target.value })}
                            />
                            <button className="btn btn-outline-primary" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </nav>
        );
    }

    componentDidMount() {
        this.apiGetCategories();
    }

    //Event handlers
    btnSearchClick(e) {
        e.preventDefault();
        this.props.navigate('/product/search/' + this.state.txtKeyword);
    }

    //APIs
    apiGetCategories() {
        axios.get('/api/customer/categories').then((res) => {
            const result = res.data;
            this.setState({categories: result});
        });
    }
}

export default withRouter(Menu);
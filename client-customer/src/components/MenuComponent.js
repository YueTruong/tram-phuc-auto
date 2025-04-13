import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import withRouter from "../utils/withRouter";

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            txtKeyword: "",
        };
    }

    render() {
        return (
            <nav className="navbar navbar-expand-lg customer-menu fixed-top">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">TPV Auto</Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            {this.state.categories.map((item) => (
                                <li key={item._id} className="nav-item">
                                    <Link className="nav-link" to={`/product/category/${item._id}`}>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <form className="d-flex search-form" onSubmit={this.btnSearchClick}>
                            <input
                                className="form-control me-2"
                                type="search"
                                placeholder="Search products"
                                aria-label="Search"
                                value={this.state.txtKeyword}
                                onChange={this.handleInputChange}
                            />
                            <button className="btn btn-outline-primary" type="submit">
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </nav>
        );
    }

    componentDidMount() {
        this.apiGetCategories();
    }

    handleInputChange = (e) => {
        this.setState({ txtKeyword: e.target.value });
    };

    btnSearchClick = (e) => {
        e.preventDefault();
        const keyword = this.state.txtKeyword.trim();
        if (keyword) {
            this.props.navigate(`/product/search/${keyword}`);
            this.setState({ txtKeyword: "" });
        }
    };

    apiGetCategories = async () => {
        try {
            const res = await axios.get("/api/customer/categories");
            console.log("Fetched categories:", res.data);
            this.setState({ categories: Array.isArray(res.data) ? res.data : [] });
        } catch (error) {
            console.error("Error fetching categories:", error.response?.data || error.message);
            this.setState({ categories: [] });
        }
    };
}

export default withRouter(Menu);
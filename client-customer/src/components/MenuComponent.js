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
            <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top w-100">
                <div className="container-fluid">
                    <Link className="navbar-brand fw-bold" to="/">Trâm Phúc Auto</Link>
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

                        {/* Search Form */}
                        <form className="d-flex" onSubmit={this.btnSearchClick}>
                            <input
                                className="form-control me-2"
                                type="search"
                                placeholder="Enter keyword"
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

    //Event-handlers
    btnSearchClick = (e) => {
        e.preventDefault();
        if (this.state.txtKeyword.trim()) {
            this.props.navigate(`/product/search/${this.state.txtKeyword}`);
        }
    };

    //APIs
    apiGetCategories = async () => {
        try {
            const res = await axios.get("/api/customer/categories");
            this.setState({ categories: res.data });
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };
}

export default withRouter(Menu);
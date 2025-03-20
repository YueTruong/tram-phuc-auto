import React, { Component } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Menu from "./MenuComponent";
import Inform from "./InformComponent";
import Home from "./HomeComponent";
import Product from "./ProductComponent";
import ProductDetail from "./ProductDetailComponent";

class Main extends Component {
    render() {
        return (
            <div className="body-customer">
                <Menu />
                <Inform />
                <Routes>
                    {/* Redirect '/' to '/home' */}
                    <Route path="/" element={<Navigate replace to="/home" />} />
                    
                    {/* Corrected Home Route */}
                    <Route path="/home" element={<Home />} />
                    
                    {/* Product Listing & Details */}
                    <Route path="/product/category/:cid" element={<Product />} />
                    <Route path="/product/search/:keyword" element={<Product />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                </Routes>
            </div>
        );
    }
}

export default Main;
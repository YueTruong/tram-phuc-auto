import React, { Component } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MyContext from "../contexts/MyContext";
import Menu from "./MenuComponent";
import Inform from "./InformComponent";
import Home from "./HomeComponent";
import Product from "./ProductComponent";
import ProductDetail from "./ProductDetailComponent";
import Register from "./RegisterComponent";
import Login from "./LoginComponent";
import Activate from "./ActivateComponent";
import Cart from "./CartComponent";

class Main extends Component {
    static contextType = MyContext; // using this.context to access global state
    
    render() {
        return (
            <div className="body-customer">
                <Menu />
                <Inform />
                <Routes>
                    <Route path="/" element={<Navigate replace to="/home" />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/product/category/:cid" element={<Product />} />
                    <Route path="/product/search/:keyword" element={<Product />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/activate" element={<Activate />} />
                    <Route path="/cart" element={<Cart />} />
                </Routes>
            </div>
        );
    }
}

export default Main;
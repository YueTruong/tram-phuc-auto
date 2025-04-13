import React, {Component} from "react";
import MyContext from "../contexts/MyContext";
import Menu from "./MenuComponent";
import Home from "./HomeComponent";
import {Routes, Route, Navigate} from "react-router-dom";
import Inform from "./InformComponent";
import Product from "./ProductComponent";
import ProductDetail from "./ProductDetailComponent";
import Register from "./RegisterComponent";
import Login from "./LoginComponent";
import Activate from "./ActivateComponent";
import Cart from "./CartComponent";
import Checkout from "./CheckoutComponent";
import Profile from "./ProfileComponent";
import Orders from "./OrderComponent";

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
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/orders" element={<Orders />} />
                    </Routes>
                </div>
            );
    }
}

export default Main;
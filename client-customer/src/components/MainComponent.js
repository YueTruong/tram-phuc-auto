import React, {Component} from "react";
import Menu from "./MenuComponent";
import Inform from "./InformComponent";
import Home from "./HomeComponent";
import {Routes, Route, Navigate} from 'react-router-dom';
import Product from './ProductComponent';
import ProductDetail from './ProductDetailComponent';

class Main extends Component {
    render() {
        return (
            <div className="body-customer">
                <Menu />
                <Inform />
                <Routes>
                    <Route path='/' element={<Navigate replace to='/home'/>}/>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/product/category/:cid' element={<Product/>}/>
                    <Route path='/product/search/:keyword' element={<Product />} />
                    <Route path='/product/:id' element={<ProductDetail />} />
                </Routes>
            </div>
        );
    }
}

export default Main;
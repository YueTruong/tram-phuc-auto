import React, { Component } from "react";
import axios from "axios";
import MyContext from "./MyContext";

class MyProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem("token") || "",
            username: "",
            cart: [],
            setToken: this.setToken,
            setUsername: this.setUsername,
            fetchCart: this.fetchCart,
            addToCart: this.addToCart,
            removeFromCart: this.removeFromCart,
            clearCart: this.clearCart,
            updateCartQuantity: this.updateCartQuantity,
        };
    }

    componentDidMount() {
        if (this.state.token) {
            this.fetchCart();
        }
    }

    setToken = (value) => {
        this.setState({ token: value }, () => {
            if (value) {
                this.fetchCart();
            } else {
                this.setState({ cart: [] });
            }
        });
    };

    setUsername = (value) => {
        this.setState({ username: value });
    };

    fetchCart = async () => {
        if (!this.state.token) return;
        try {
            const res = await axios.get("/api/customer/cart", {
                headers: { Authorization: `Bearer ${this.state.token}` },
            });
            this.setState({ cart: res.data.items || [] });
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    addToCart = async (product, quantity) => {
        const updatedCart = [...this.state.cart];
        const existingItem = updatedCart.find((item) => item._id === product._id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            updatedCart.push({ ...product, quantity });
        }
        this.setState({ cart: updatedCart });
        await this.syncCartWithBackend(updatedCart);
    };

    removeFromCart = async (productId) => {
        const updatedCart = this.state.cart.filter((item) => item._id !== productId);
        this.setState({ cart: updatedCart });
        await this.syncCartWithBackend(updatedCart);
    };

    clearCart = async () => {
        this.setState({ cart: [] });
        if (this.state.token) {
            await axios.delete("/api/customer/cart", {
                headers: { Authorization: `Bearer ${this.state.token}` },
            });
        }
    };

    updateCartQuantity = async (productId, newQuantity) => {
        const updatedCart = this.state.cart.map((item) =>
            item._id === productId ? { ...item, quantity: newQuantity } : item
        );
        this.setState({ cart: updatedCart });
        await this.syncCartWithBackend(updatedCart);
    };

    syncCartWithBackend = async (updatedCart) => {
        if (this.state.token) {
            try {
                await axios.post(
                    "/api/customer/cart",
                    { items: updatedCart },
                    { headers: { Authorization: `Bearer ${this.state.token}` } }
                );
            } catch (error) {
                console.error("Error syncing cart with backend:", error);
            }
        }
    };

    render() {
        return (
            <MyContext.Provider value={this.state}>
                {this.props.children}
            </MyContext.Provider>
        );
    }
}

export default MyProvider;
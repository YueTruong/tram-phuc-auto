import React, { Component } from "react";
import axios from "axios";
import MyContext from "./MyContext";

class MyProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Variables
            token: localStorage.getItem("token") || "",
            username: "",
            customer: null,
            mycart: JSON.parse(localStorage.getItem("cart")) || [],
            // Functions
            setToken: this.setToken,
            setUsername: this.setUsername,
            setCustomer: this.setCustomer,
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
        this.setState({ token: value }, async () => {
            localStorage.setItem("token", value);
            if (value) {
                // Sync localStorage cart on sign-in
                await this.syncCartWithBackend(this.state.mycart);
                await this.fetchCart();
            } else {
                localStorage.removeItem("token");
                localStorage.removeItem("cart");
            }
        });
    };

    setUsername = (value) => {
        this.setState({ username: value });
    };

    setCustomer = (value) => {
        this.setState({ customer: value });
    };

    fetchCart = async () => {
        if (!this.state.token) return;
        try {
            const res = await axios.get("/api/customer/cart", {
                headers: { Authorization: `Bearer ${this.state.token}` },
            });
            if (res.data && res.data.items) {
                const cartItems = res.data.items.map(item => ({
                    _id: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    image: item.product.image,
                    cdate: item.product.cdate,
                    category: item.product.category,
                    quantity: item.quantity
                }));
                this.setState({ mycart: cartItems });
                localStorage.setItem("cart", JSON.stringify(cartItems));
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    addToCart = (product, quantity) => {
        if (!product || !product._id) return;
        this.setState(
            prevState => {
                const updatedCart = [...prevState.mycart];
                const existingItem = updatedCart.find(item => item._id === product._id);
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    updatedCart.push({ ...product, quantity });
                }
                if (!prevState.token) {
                    localStorage.setItem("cart", JSON.stringify(updatedCart));
                }
                return { mycart: updatedCart };
            },
            () => {
                if (this.state.token) {
                    this.syncCartWithBackend(this.state.mycart);
                }
            }
        );
    };

    removeFromCart = async (productId) => {
        const updatedCart = this.state.mycart.filter((item) => item._id !== productId);
        this.setState({ mycart: updatedCart }, () => {
            if (!this.state.token) {
                localStorage.setItem("cart", JSON.stringify(updatedCart));
            }
            if (this.state.token) {
                this.syncCartWithBackend(updatedCart);
            }
        });
    };

    clearCart = async () => {
        this.setState({ mycart: [] }, () => {
            localStorage.setItem("cart", JSON.stringify([]));
            if (this.state.token) {
                axios.delete("/api/customer/cart", {
                    headers: { Authorization: `Bearer ${this.state.token}` },
                });
            }
        });
    };

    updateCartQuantity = async (productId, newQuantity) => {
        if (!productId || newQuantity < 1) return;
        const updatedCart = this.state.mycart.map((item) =>
            item._id === productId ? { ...item, quantity: newQuantity } : item
        );
        this.setState({ mycart: updatedCart }, () => {
            if (!this.state.token) {
                localStorage.setItem("cart", JSON.stringify(updatedCart));
            }
            if (this.state.token) {
                this.syncCartWithBackend(updatedCart);
            }
        });
    };

    syncCartWithBackend = async (updatedCart) => {
        try {
            await axios.post(
                "/api/customer/cart/sync",
                { items: updatedCart },
                { headers: { Authorization: `Bearer ${this.state.token}` } }
            );
            await this.fetchCart(); // Refresh cart after sync
        } catch (error) {
            console.error("Error syncing cart with backend:", error);
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
import React, { Component } from "react";
import axios from "axios";
import MyContext from "./MyContext";

class MyProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem("token") || "",
            username: "",
            customer: null,
            mycart: JSON.parse(localStorage.getItem("cart")) || [],
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
            this.fetchCustomer();
            this.fetchCart();
        }
    }

    setToken = (value) => {
        this.setState({ token: value }, async () => {
            localStorage.setItem("token", value);
            if (value) {
                await this.fetchCustomer();
                await this.syncCartWithBackend(this.state.mycart);
                await this.fetchCart();
            } else {
                localStorage.removeItem("token");
                this.setState({ mycart: [], customer: null, username: "" });
                localStorage.setItem("cart", JSON.stringify([]));
            }
        });
    };

    setUsername = (value) => {
        this.setState({ username: value });
    };

    setCustomer = (value) => {
        console.log("Setting customer:", value);
        this.setState({ customer: value });
    };

    fetchCustomer = async () => {
        if (!this.state.token) {
            console.log("No token for fetchCustomer");
            return;
        }
        try {
            const res = await axios.get("/api/customer/profile", {
                headers: { Authorization: `Bearer ${this.state.token}` },
            });
            console.log("Fetch customer response:", res.data);
            if (res.data && res.data._id) {
                this.setCustomer(res.data);
            } else {
                console.log("No valid customer data, preserving existing:", this.state.customer);
            }
        } catch (error) {
            console.error("Error fetching customer:", error.response?.data || error.message);
            console.log("Preserving existing customer:", this.state.customer);
        }
    };

    fetchCart = async () => {
        if (!this.state.token) return;
        try {
            const res = await axios.get("/api/customer/cart", {
                headers: { Authorization: `Bearer ${this.state.token}` },
            });
            console.log("Fetch cart response:", res.data);
            if (res.data && Array.isArray(res.data.items)) {
                const cartItems = res.data.items
                    .filter(item => item.product && item.product._id)
                    .map(item => ({
                        _id: item.product._id.toString(),
                        name: item.product.name || "Unknown",
                        price: item.product.price || 0,
                        image: item.product.image || "",
                        cdate: item.product.cdate || new Date(),
                        category: item.product.category || {},
                        quantity: item.quantity || 1
                    }));
                this.setState({ mycart: cartItems });
                localStorage.setItem("cart", JSON.stringify(cartItems));
            } else {
                console.log("Server cart empty, preserving local cart:", this.state.mycart);
                localStorage.setItem("cart", JSON.stringify(this.state.mycart));
                if (this.state.mycart.length > 0) {
                    await this.syncCartWithBackend(this.state.mycart);
                }
            }
        } catch (error) {
            console.error("Error fetching cart:", error.response?.data || error.message);
            console.log("Preserving local cart:", this.state.mycart);
            localStorage.setItem("cart", JSON.stringify(this.state.mycart));
        }
    };

    addToCart = (product, quantity) => {
        if (!product || !product._id) return;
        this.setState(
            prevState => {
                const updatedCart = [...prevState.mycart];
                const existingItem = updatedCart.find(item => item._id === product._id);
                if (existingItem) {
                    existingItem.quantity = quantity;
                } else {
                    updatedCart.push({ ...product, quantity, _id: product._id.toString() });
                }
                localStorage.setItem("cart", JSON.stringify(updatedCart));
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
        console.log("Removing product:", productId);
        const updatedCart = this.state.mycart.filter((item) => item._id !== productId);
        this.setState({ mycart: updatedCart }, async () => {
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            if (this.state.token) {
                await this.syncCartWithBackend(updatedCart);
            }
        });
    };

    clearCart = async () => {
        this.setState({ mycart: [] }, () => {
            localStorage.setItem("cart", JSON.stringify([]));
            if (this.state.token) {
                axios.delete("/api/customer/cart", {
                    headers: { Authorization: `Bearer ${this.state.token}` },
                }).catch(error => {
                    console.error("Error clearing cart:", error);
                });
            }
        });
    };

    updateCartQuantity = async (productId, newQuantity) => {
        if (!productId || newQuantity < 1) return;
        console.log("Updating quantity for product:", productId, "to:", newQuantity);
        this.setState(
            prevState => {
                const updatedCart = prevState.mycart.map(item =>
                    item._id === productId ? { ...item, quantity: newQuantity } : item
                );
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                return { mycart: updatedCart };
            },
            () => {
                if (this.state.token) {
                    this.syncCartWithBackend(this.state.mycart);
                }
            }
        );
    };

    syncCartWithBackend = async (updatedCart) => {
        if (!this.state.token) return;
        try {
            console.log("Syncing cart:", updatedCart);
            const validCart = updatedCart.filter(item => item._id && item.quantity > 0);
            const response = await axios.post(
                "/api/customer/cart/sync",
                { items: validCart },
                { headers: { Authorization: `Bearer ${this.state.token}` } }
            );
            console.log("Sync response:", response.data);
            await this.fetchCart();
        } catch (error) {
            console.error("Error syncing cart:", error.response?.data || error.message);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
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
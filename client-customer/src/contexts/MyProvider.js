import React, {Component} from "react";
import axios from "axios";
import MyContext from "./MyContext";

class MyProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //Variables
            token: '',
            username: '',
            customer: null,
            mycart: [],
            //Functions
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
        this.setState({token: value});
    }

    setUsername = (value) => {
        this.setState({username: value});
    }

    setCustomer = (value) => {
        this.setState({customer: value});
    }

    fetchCart = async () => {
        if (!this.state.token) return;
        try {
            const res = await axios.get("/api/customer/cart", {
                headers: { Authorization: `Bearer ${this.state.token}` },
            });
            if (res.data && res.data.items) {
                this.setState({ mycart: res.data.items });
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    addToCart = async (product, quantity) => {
        if (!product || !product._id) return;
        const updatedCart = [...this.state.mycart];
        const existingItem = updatedCart.find((item) => item._id === product._id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            updatedCart.push({ ...product, quantity });
        }
        this.setState({ mycart: updatedCart });
        if (this.state.token) {
            await this.syncCartWithBackend(updatedCart);
        }
    };

    removeFromCart = async (productId) => {
        const updatedCart = this.state.mycart.filter((item) => item._id !== productId);
        this.setState({ mycart: updatedCart });
        if (this.state.token) {
            await this.syncCartWithBackend(updatedCart);
        }
    };

    clearCart = async () => {
        this.setState({ mycart: [] });
        if (this.state.token) {
            await axios.delete("/api/customer/cart", {
                headers: { Authorization: `Bearer ${this.state.token}` },
            });
        }
    };

    updateCartQuantity = async (productId, newQuantity) => {
        if (!productId || newQuantity < 1) return;
        const updatedCart = this.state.mycart.map((item) =>
            item._id === productId ? { ...item, quantity: newQuantity } : item
        );
        this.setState({ mycart: updatedCart });
        if (this.state.token) {
            await this.syncCartWithBackend(updatedCart);
        }
    };

    syncCartWithBackend = async (updatedCart) => {
        try {
            await axios.post(
                "/api/customer/cart",
                { items: updatedCart },
                { headers: { Authorization: `Bearer ${this.state.token}` } }
            );
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
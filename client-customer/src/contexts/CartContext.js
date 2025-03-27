import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const token = localStorage.getItem("token");

    const fetchCart = useCallback(async () => {
        if (!token) return;
        try {
            const res = await axios.get("/api/customer/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCart(res.data.items || []);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    }, [token]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const updateCart = async (updatedCart) => {
        setCart(updatedCart);
        if (token) {
            try {
                await axios.post("/api/customer/cart", { items: updatedCart }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch (error) {
                console.error("Error updating cart:", error);
            }
        }
    };

    const addToCart = (product, quantity) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item._id === product._id);
            if (existingItem) {
                return prevCart.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity }];
            }
        });
    };

    const removeFromCart = (productId) => {
        const newCart = cart.filter((item) => item.productId !== productId);
        updateCart(newCart);
    };

    const clearCart = () => {
        setCart([]);
        if (token) {
            axios.delete("/api/customer/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });
        } else {
            localStorage.removeItem("cart");
        }
    };

    const updateCartQuantity = (productId, newQuantity) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.productId === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateCartQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
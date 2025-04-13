const { Cart } = require("./Models");
const mongoose = require("mongoose");

const CartDAO = {
    async getCart(customerId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(customerId)) {
                console.error("Invalid customerId for getCart:", customerId);
                return { items: [] };
            }
            const cart = await Cart.findOne({ "customer._id": customerId });
            console.log("Fetched cart for customer:", customerId, "Cart:", cart);
            return cart || { items: [] };
        } catch (error) {
            console.error("❌ Error fetching cart:", error);
            return { items: [] };
        }
    },

    async updateCart(customerId, items) {
        try {
            if (!mongoose.Types.ObjectId.isValid(customerId)) {
                console.error("Invalid customerId for updateCart:", customerId);
                return { items: [] };
            }
            let cart = await Cart.findOne({ "customer._id": customerId });
            if (!cart) {
                cart = new Cart({
                    _id: new mongoose.Types.ObjectId(),
                    customer: { _id: customerId },
                    items: [],
                    cdate: Date.now()
                });
            }
            console.log("Updating cart for customer:", customerId, "with items:", items);
            cart.items = items
                .filter(item => item._id && mongoose.Types.ObjectId.isValid(item._id))
                .map(item => ({
                    product: {
                        _id: item._id,
                        name: item.name || "Unknown",
                        price: item.price || 0,
                        image: item.image || "",
                        cdate: item.cdate || new Date(),
                        category: item.category || {}
                    },
                    quantity: item.quantity || 1
                }));
            const savedCart = await cart.save();
            console.log("Updated cart:", savedCart);
            return savedCart;
        } catch (error) {
            console.error("❌ Error updating cart:", error);
            return { items: [] };
        }
    },

    async clearCart(customerId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(customerId)) {
                console.error("Invalid customerId for clearCart:", customerId);
                return false;
            }
            const result = await Cart.findOneAndUpdate(
                { "customer._id": customerId },
                { items: [] },
                { new: true }
            );
            console.log("Cleared cart for customer:", customerId, "Result:", result);
            return true;
        } catch (error) {
            console.error("❌ Error clearing cart:", error);
            return false;
        }
    },

    async syncCart(customerId, localCart) {
        try {
            if (!mongoose.Types.ObjectId.isValid(customerId)) {
                console.error("Invalid customerId for syncCart:", customerId);
                return { items: [] };
            }
            let cart = await Cart.findOne({ "customer._id": customerId });
            if (!cart) {
                cart = new Cart({
                    _id: new mongoose.Types.ObjectId(),
                    customer: { _id: customerId },
                    items: [],
                    cdate: Date.now()
                });
            }
            console.log("Syncing cart for customer:", customerId, "with items:", localCart);
            cart.items = localCart
                .filter(item => item._id && mongoose.Types.ObjectId.isValid(item._id))
                .map(item => ({
                    product: {
                        _id: item._id,
                        name: item.name || "Unknown",
                        price: item.price || 0,
                        image: item.image || "",
                        cdate: item.cdate || new Date(),
                        category: item.category || {}
                    },
                    quantity: item.quantity || 1
                }));
            const savedCart = await cart.save();
            console.log("Synced cart:", savedCart);
            return savedCart;
        } catch (error) {
            console.error("❌ Error syncing cart:", error);
            return { items: [] };
        }
    }
};

module.exports = CartDAO;
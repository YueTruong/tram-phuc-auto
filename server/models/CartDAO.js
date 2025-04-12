const mongoose = require("mongoose");
const { Cart } = require("./Models");

const CartDAO = {
    async getCart(customerId) {
        try {
            return await Cart.findOne({ "customer._id": customerId });
        } catch (error) {
            console.error("❌ Error fetching cart:", error);
            return null;
        }
    },

    async updateCart(customerId, items) {
        try {
            let cart = await Cart.findOne({ "customer._id": customerId });
            if (!cart) {
                cart = new Cart({
                    _id: new mongoose.Types.ObjectId(),
                    customer: { _id: customerId },
                    items: [],
                    cdate: Date.now()
                });
            }
            cart.items = items.map(item => ({
                product: { 
                    _id: item._id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    cdate: item.cdate,
                    category: item.category
                },
                quantity: item.quantity
            }));
            return await cart.save();
        } catch (error) {
            console.error("❌ Error updating cart:", error);
            return null;
        }
    },

    async clearCart(customerId) {
        try {
            return await Cart.deleteOne({ "customer._id": customerId });
        } catch (error) {
            console.error("❌ Error clearing cart:", error);
            return null;
        }
    },

    async syncCart(customerId, localCart) {
        try {
            let cart = await Cart.findOne({ "customer._id": customerId });
            if (!cart) {
                cart = new Cart({
                    _id: new mongoose.Types.ObjectId(),
                    customer: { _id: customerId },
                    items: [],
                    cdate: Date.now()
                });
            }
            // Merge localCart with existing cart
            const existingItems = cart.items.reduce((map, item) => {
                map[item.product._id.toString()] = item.quantity;
                return map;
            }, {});
            for (const item of localCart) {
                const productId = item._id;
                const quantity = item.quantity;
                if (existingItems[productId]) {
                    existingItems[productId] += quantity; // Sum quantities
                } else {
                    cart.items.push({
                        product: {
                            _id: productId,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                            cdate: item.cdate,
                            category: item.category
                        },
                        quantity
                    });
                }
            }
            // Update quantities for existing items
            cart.items = cart.items.map(item => ({
                product: item.product,
                quantity: existingItems[item.product._id.toString()] || item.quantity
            }));
            return await cart.save();
        } catch (error) {
            console.error("❌ Error syncing cart:", error);
            return null;
        }
    }
};

module.exports = CartDAO;
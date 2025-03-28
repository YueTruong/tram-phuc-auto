const Models = require("./Models");

const CartDAO = {
    async getCart(customerId) {
        try {
            return await Models.Cart.findOne({ customerId }).populate("items.productId");
        } catch (error) {
            console.error("❌ Error fetching cart:", error);
            return null;
        }
    },

    async updateCart(customerId, items) {
        try {
            return await Models.Cart.findOneAndUpdate(
                { customerId },
                { items },
                { upsert: true, new: true }
            );
        } catch (error) {
            console.error("❌ Error updating cart:", error);
            return null;
        }
    },

    async clearCart(customerId) {
        try {
            return await Models.Cart.deleteOne({ customerId });
        } catch (error) {
            console.error("❌ Error clearing cart:", error);
            return null;
        }
    }
};

module.exports = CartDAO;
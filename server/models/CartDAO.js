const { Cart } = require("./Models");

const CartDAO = {
    async getCart(customerId) {
        return await Cart.findOne({ customerId }).populate("items.productId");
    },

    async updateCart(customerId, items) {
        return await Cart.findOneAndUpdate(
            { customerId },
            { items },
            { upsert: true, new: true }
        );
    },

    async clearCart(customerId) {
        return await Cart.deleteOne({ customerId });
    }
};

module.exports = CartDAO;
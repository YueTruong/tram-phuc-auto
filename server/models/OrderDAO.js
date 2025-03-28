require("../utils/MongooseUtil");
const Models = require("./Models");

const OrderDAO = {
    async createOrder(order) {
        try {
            const mongoose = require("mongoose");
            order._id = new mongoose.Types.ObjectId();
            const result = await Models.Order.create(order);
            return result;
        } catch (error) {
            console.error("❌ Error creating order:", error);
            return null;
        }
    },

    async getOrdersByCustomer(customerId) {
        try {
            return await Models.Order.find({ "customer._id": customerId })
                .populate("customer")
                .populate("items.product")
                .exec();
        } catch (error) {
            console.error("❌ Error fetching orders by customer:", error);
            return [];
        }
    },

    async getAllOrders() {
        try {
            return await Models.Order.find()
                .populate("customer")
                .populate("items.product")
                .exec();
        } catch (error) {
            console.error("❌ Error fetching all orders:", error);
            return [];
        }
    },

    async updateOrderStatus(orderId, status) {
        try {
            return await Models.Order.findByIdAndUpdate(
                orderId,
                { status },
                { new: true }
            );
        } catch (error) {
            console.error("❌ Error updating order status:", error);
            return null;
        }
    },
};

module.exports = OrderDAO;
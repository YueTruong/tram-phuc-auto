require("../utils/MongooseUtil");
const Models = require("./Models");

const OrderDAO = {
    async createOrder(order) {
        const mongoose = require("mongoose");
        order._id = new mongoose.Types.ObjectId();
        const result = await Models.Order.create(order);
        return result;
    },

    async getOrdersByCustomer(customerId) {
        return await Models.Order.find({ customer: customerId }).populate("items.product").exec();
    },

    async getAllOrders() {
        return await Models.Order.find().populate("customer").populate("items.product").exec();
    },

    async updateOrderStatus(orderId, status) {
        return await Models.Order.findByIdAndUpdate(orderId, { status }, { new: true });
    },
};

module.exports = OrderDAO;
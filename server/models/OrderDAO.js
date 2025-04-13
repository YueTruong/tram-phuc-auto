const Models = require("./Models");
const mongoose = require("mongoose");

const OrderDAO = {
    async createOrder(order) {
        try {
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
            if (!mongoose.Types.ObjectId.isValid(customerId)) {
                console.error("Invalid customerId:", customerId);
                return [];
            }
            return await Models.Order.find({ "customer._id": customerId })
                .populate("customer")
                .populate("items.product")
                .exec();
        } catch (error) {
            console.error("❌ Error fetching orders by customer:", error);
            return [];
        }
    },

    async selectAll() {
        try {
            const orders = await Models.Order.find({}).exec();
            return orders;
        } catch (error) {
            console.error("❌ Error fetching all orders:", error);
            return [];
        }
    },

    async selectByID(_id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                console.error("Invalid order ID:", _id);
                return null;
            }
            const order = await Models.Order.findById(_id).exec();
            return order;
        } catch (error) {
            console.error("❌ Error fetching order by ID:", error);
            return null;
        }
    },

    async update(order) {
        try {
            if (!mongoose.Types.ObjectId.isValid(order._id)) {
                console.error("Invalid order ID for update:", order._id);
                return null;
            }
            const result = await Models.Order.findByIdAndUpdate(order._id, order, { new: true }).exec();
            return result;
        } catch (error) {
            console.error("❌ Error updating order:", error);
            return null;
        }
    },

    async delete(_id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                console.error("Invalid order ID for delete:", _id);
                return false;
            }
            const result = await Models.Order.findByIdAndDelete(_id).exec();
            return !!result;
        } catch (error) {
            console.error("❌ Error deleting order:", error);
            return false;
        }
    }
};

module.exports = OrderDAO;
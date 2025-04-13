const { Order } = require("./Models");
const mongoose = require("mongoose");

const OrderDAO = {
    async createOrder(order) {
        try {
            console.log("Creating order:", JSON.stringify(order, null, 2));
            const newOrder = new Order(order);
            const savedOrder = await newOrder.save();
            console.log("Order created:", JSON.stringify(savedOrder, null, 2));
            return savedOrder;
        } catch (error) {
            console.error("❌ Error creating order:", error.message, error.stack);
            return null;
        }
    },

    async getOrdersByCustomer(customerId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(customerId)) {
                console.error("Invalid customerId for getOrdersByCustomer:", customerId);
                return [];
            }
            const orders = await Order.find({ "customer._id": customerId })
                .sort({ cdate: -1 });
            console.log("Fetched orders for customer:", customerId, "Orders:", JSON.stringify(orders, null, 2));
            return orders;
        } catch (error) {
            console.error("❌ Error fetching customer orders:", error.message, error.stack);
            return [];
        }
    },

    async find() {
        try {
            const orders = await Order.find()
                .sort({ cdate: -1 });
            console.log("Fetched all orders:", JSON.stringify(orders, null, 2));
            return orders;
        } catch (error) {
            console.error("❌ Error fetching all orders:", error.message, error.stack);
            return [];
        }
    },

    async updateOrderStatus(orderId, status) {
        try {
            if (!mongoose.Types.ObjectId.isValid(orderId)) {
                console.error("Invalid orderId for updateOrderStatus:", orderId);
                return null;
            }
            const order = await Order.findByIdAndUpdate(
                orderId,
                { status },
                { new: true }
            );
            console.log(`Updated order ${orderId} to status: ${status}`, JSON.stringify(order, null, 2));
            return order;
        } catch (error) {
            console.error("❌ Error updating order status:", error.message, error.stack);
            return null;
        }
    }
};

module.exports = OrderDAO;
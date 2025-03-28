require('../utils/MongooseUtil');
const mongoose = require('mongoose');
const Models = require('./Models');

const CustomerDAO = {
    async selectByUsernameOrEmail(username, email) {
        try {
            return await Models.Customer.findOne({
                $or: [{ username }, { email }]
            });
        } catch (error) {
            console.error("❌ Error selecting customer by username or email:", error);
            return null;
        }
    },

    async insert(customer) {
        try {
            customer._id = new mongoose.Types.ObjectId();
            return await Models.Customer.create(customer);
        } catch (error) {
            console.error("❌ Error inserting customer:", error);
            return null;
        }
    },

    async active(_id, token, active) {
        try {
            return await Models.Customer.findOneAndUpdate(
                { _id, token },
                { active },
                { new: true }
            );
        } catch (error) {
            console.error("❌ Error activating customer:", error);
            return null;
        }
    },

    async selectByUsernameAndPassword(username, password) {
        try {
            return await Models.Customer.findOne({ username, password });
        } catch (error) {
            console.error("❌ Error selecting customer by username and password:", error);
            return null;
        }
    },

    async update(customer) {
        try {
            const updateFields = {
                username: customer.username,
                password: customer.password,
                name: customer.name,
                phone: customer.phone,
                email: customer.email
            };

            return await Models.Customer.findByIdAndUpdate(customer._id, updateFields, { new: true });
        } catch (error) {
            console.error("❌ Error updating customer:", error);
            return null;
        }
    },

    async selectAll() {
        try {
            return await Models.Customer.find({}, '-password'); // Không trả về password
        } catch (error) {
            console.error("❌ Error fetching all customers:", error);
            return [];
        }
    },

    async selectByID(_id) {
        try {
            return await Models.Customer.findById(_id, '-password'); // Không trả về password
        } catch (error) {
            console.error(`❌ Error fetching customer by ID: ${_id}`, error);
            return null;
        }
    }
};

module.exports = CustomerDAO;
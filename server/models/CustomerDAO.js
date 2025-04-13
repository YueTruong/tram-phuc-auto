const Models = require("./Models");
const mongoose = require("mongoose");

const CustomerDAO = {
    async selectAll() {
        const customers = await Models.Customer.find({}).exec();
        return customers;
    },

    async selectByID(_id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                console.error("Invalid customer ID:", _id);
                return null;
            }
            const customer = await Models.Customer.findById(_id).exec();
            return customer;
        } catch (error) {
            console.error("❌ Error fetching customer by ID:", error);
            return null;
        }
    },

    async insert(customer) {
        const newCustomer = new Models.Customer(customer);
        const result = await newCustomer.save();
        return result;
    },

    async update(customer) {
        try {
            if (!mongoose.Types.ObjectId.isValid(customer._id)) {
                console.error("Invalid customer ID for update:", customer._id);
                return null;
            }
            const result = await Models.Customer.findByIdAndUpdate(customer._id, customer, { new: true });
            return result;
        } catch (error) {
            console.error("❌ Error updating customer:", error);
            return null;
        }
    },

    async delete(_id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                console.error("Invalid customer ID for delete:", _id);
                return false;
            }
            const result = await Models.Customer.findByIdAndDelete(_id);
            return result ? true : false;
        } catch (error) {
            console.error("❌ Error deleting customer:", error);
            return false;
        }
    },

    async selectByUsernameOrEmail(username, email) {
        const customer = await Models.Customer.findOne({
            $or: [{ username: username }, { email: email }],
        });
        return customer;
    },

    async selectByUsernameAndPassword(username, password) {
        const customer = await Models.Customer.findOne({ username: username, password: password });
        return customer;
    },

    async active(_id, token, active) {
        try {
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                console.error("Invalid customer ID for activation:", _id);
                return null;
            }
            const customer = await Models.Customer.findOneAndUpdate(
                { _id: _id, token: token },
                { active: active },
                { new: true }
            );
            return customer;
        } catch (error) {
            console.error("❌ Error activating customer:", error);
            return null;
        }
    }
};

module.exports = CustomerDAO;
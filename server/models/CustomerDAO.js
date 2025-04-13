const Models = require("./Models");
const mongoose = require("mongoose");

const CustomerDAO = {
    async selectAll() {
        try {
            console.log("Fetching all customers");
            const customers = await Models.Customer.find({}).exec();
            console.log("Fetched customers:", customers.length);
            return customers;
        } catch (error) {
            console.error("❌ Error fetching all customers:", error.message, error.stack);
            return [];
        }
    },

    async selectByID(_id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                console.error("Invalid customer ID:", _id);
                return null;
            }
            console.log("Fetching customer by ID:", _id);
            const customer = await Models.Customer.findById(_id).exec();
            console.log("Customer fetched:", customer ? customer._id : null);
            return customer;
        } catch (error) {
            console.error("❌ Error fetching customer by ID:", error.message, error.stack);
            return null;
        }
    },

    async insert(customer) {
        try {
            console.log("Inserting customer:", JSON.stringify(customer, null, 2));
            if (!customer._id || !mongoose.Types.ObjectId.isValid(customer._id)) {
                console.log("Invalid or missing _id, generating new one");
                customer._id = new mongoose.Types.ObjectId();
            }
            const newCustomer = new Models.Customer(customer);
            const result = await newCustomer.save();
            console.log("Customer inserted:", JSON.stringify(result, null, 2));
            return result;
        } catch (error) {
            if (error.code === 11000) { // Duplicate key error
                console.error("Duplicate key error:", error.message);
                return null;
            }
            console.error("❌ Error inserting customer:", error.message, error.stack);
            return null;
        }
    },

    async update(customer) {
        try {
            if (!mongoose.Types.ObjectId.isValid(customer._id)) {
                console.error("Invalid customer ID for update:", customer._id);
                return null;
            }
            console.log("Updating customer:", customer._id);
            const result = await Models.Customer.findByIdAndUpdate(customer._id, customer, { new: true });
            console.log("Customer updated:", result ? result._id : null);
            return result;
        } catch (error) {
            console.error("❌ Error updating customer:", error.message, error.stack);
            return null;
        }
    },

    async delete(_id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                console.error("Invalid customer ID for delete:", _id);
                return false;
            }
            console.log("Deleting customer:", _id);
            const result = await Models.Customer.findByIdAndDelete(_id);
            console.log("Customer deleted:", result ? true : false);
            return result ? true : false;
        } catch (error) {
            console.error("❌ Error deleting customer:", error.message, error.stack);
            return false;
        }
    },

    async selectByUsernameOrEmail(username, email) {
        try {
            console.log("Checking username or email:", { username, email });
            const customer = await Models.Customer.findOne({
                $or: [{ username: username }, { email: email }],
            });
            console.log("Customer found:", customer ? customer._id : null);
            return customer;
        } catch (error) {
            console.error("❌ Error checking username or email:", error.message, error.stack);
            return null;
        }
    },

    async selectByUsernameAndPassword(username, password) {
        try {
            console.log("Checking username and password:", { username });
            const customer = await Models.Customer.findOne({ username: username, password: password });
            console.log("Customer authenticated:", customer ? customer._id : null);
            return customer;
        } catch (error) {
            console.error("❌ Error authenticating customer:", error.message, error.stack);
            return null;
        }
    },

    async active(_id, token, active) {
        try {
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                console.error("Invalid customer ID for activation:", _id);
                return null;
            }
            console.log("Activating customer:", { _id, token, active });
            const customer = await Models.Customer.findOneAndUpdate(
                { _id: _id, token: token },
                { active: active },
                { new: true }
            );
            console.log("Customer activation result:", customer ? customer._id : null);
            return customer;
        } catch (error) {
            console.error("❌ Error activating customer:", error.message, error.stack);
            return null;
        }
    }
};

module.exports = CustomerDAO;
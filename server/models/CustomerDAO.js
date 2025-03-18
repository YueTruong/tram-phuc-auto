require('../utils/MongooseUtil');
const Models = require('./Models');
const CustomerDAO = {
    async selectByUsernameAndPassword(username, password) {
        const query = { username: username, password: password };
        const customer = await Models.Customer.findOne(query);
        return customer;
    }
};
module.exports = CustomerDAO;
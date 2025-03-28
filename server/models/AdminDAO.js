require('../utils/MongooseUtil');
const Models = require('./Models');

const AdminDAO = {
    async selectByUsernameAndPassword(username, password) {
        try {
            const query = { username, password };
            return await Models.Admin.findOne(query);
        } catch (error) {
            console.error("❌ Error fetching admin:", error);
            return null;
        }
    }
};

module.exports = AdminDAO;
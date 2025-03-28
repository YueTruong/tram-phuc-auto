require('../utils/MongooseUtil');
const Models = require('./Models');
const mongoose = require('mongoose'); // Chỉ require mongoose một lần

const CategoryDAO = {
    async selectAll() {
        try {
            return await Models.Category.find({});
        } catch (error) {
            console.error("❌ Error fetching categories:", error);
            return [];
        }
    },
    
    async insert(category) {
        try {
            category._id = new mongoose.Types.ObjectId();
            return await Models.Category.create(category);
        } catch (error) {
            console.error("❌ Error inserting category:", error);
            return null;
        }
    },

    async update(category) {
        try {
            return await Models.Category.findByIdAndUpdate(
                category._id, 
                { name: category.name },
                { new: true } // Trả về dữ liệu đã cập nhật
            );
        } catch (error) {
            console.error("❌ Error updating category:", error);
            return null;
        }
    },

    async delete(_id) {
        try {
            return await Models.Category.findByIdAndDelete(_id);
        } catch (error) {
            console.error("❌ Error deleting category:", error);
            return null;
        }
    },
    
    async selectByID(_id) {
        try {
            return await Models.Category.findById(_id).exec();
        } catch (error) {
            console.error("❌ Error fetching category by ID:", error);
            return null;
        }
    },
};

module.exports = CategoryDAO;
require('../utils/MongooseUtil');
const mongoose = require('mongoose');
const Models = require('./Models');

const ProductDAO = {
    async selectAll() {
        try {
            return await Models.Product.find({});
        } catch (error) {
            console.error("❌ Error fetching products:", error);
            return [];
        }
    },

    async insert(product) {
        try {
            product._id = new mongoose.Types.ObjectId();
            return await Models.Product.create(product);
        } catch (error) {
            console.error("❌ Error inserting product:", error);
            return null;
        }
    },

    async update(product) {
        try {
            const newValues = {
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category
            };
            return await Models.Product.findByIdAndUpdate(product._id, newValues, { new: true });
        } catch (error) {
            console.error("❌ Error updating product:", error);
            return null;
        }
    },
    
    async delete(_id) {
        try {
            return await Models.Product.findByIdAndDelete(_id);
        } catch (error) {
            console.error("❌ Error deleting product:", error);
            return null;
        }
    },

    async selectByID(_id) {
        try {
            return await Models.Product.findById(_id);
        } catch (error) {
            console.error(`❌ Error fetching product with ID: ${_id}`, error);
            return null;
        }
    },

    async selectTopNew(top) {
        try {
            return await Models.Product.find({}).sort({ cdate: -1 }).limit(top);
        } catch (error) {
            console.error("❌ Error fetching top new products:", error);
            return [];
        }
    },

    async selectTopHot(top) {
        try {
            const items = await Models.Order.aggregate([
                { $match: { status: 'APPROVED' } },
                { $unwind: '$items' },
                { $group: { _id: '$items.product._id', sum: { $sum: '$items.quantity' } } },
                { $sort: { sum: -1 } },
                { $limit: top }
            ]);

            const productIds = items.map(item => item._id);
            return await Models.Product.find({ _id: { $in: productIds } });
        } catch (error) {
            console.error("❌ Error fetching top hot products:", error);
            return [];
        }
    },

    async selectByCatID(_cid) {
        try {
            return await Models.Product.find({ 'category._id': _cid });
        } catch (error) {
            console.error(`❌ Error fetching products by category ID: ${_cid}`, error);
            return [];
        }
    },

    async selectByKeyword(keyword) {
        try {
            return await Models.Product.find({ name: { $regex: new RegExp(keyword, "i") } });
        } catch (error) {
            console.error(`❌ Error fetching products by keyword: ${keyword}`, error);
            return [];
        }
    }
};

module.exports = ProductDAO;
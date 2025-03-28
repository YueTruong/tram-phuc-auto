//CLI: npm install mongoose --save
const mongoose = require('mongoose');

//Schemas
const AdminSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String
}, {versionKey: false});

const CategorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String
}, {versionKey: false});

const CustomerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    name: String,
    phone: String,
    email: String,
    active: Number,
    token: String
}, {versionKey: false});

const ProductSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    image: String,
    cdate: Number,
    category: CategorySchema
}, {versionKey: false});

const ItemSchema = mongoose.Schema({
    product: ProductSchema,
    quantity: Number
}, {versionKey: false, _id: false});

const OrderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    cdate: Number,
    total: Number,
    status: String,
    customer: CustomerSchema,
    items: [ItemSchema]
}, {versionKey: false});

const CartSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // Thêm _id cho đồng nhất với các schema khác
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true }, // Thay customerId bằng customer dùng ref
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Thay productId bằng product
            quantity: { type: Number, required: true, default: 1 },
        }
    ],
    cdate: { type: Number, default: Date.now } // Thêm thời gian tạo giỏ hàng
}, { versionKey: false });

//Models
const Admin = mongoose.model('Admin', AdminSchema);
const Category = mongoose.model('Category', CategorySchema);
const Customer = mongoose.model('Customer', CustomerSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);
const Cart = mongoose.model("Cart", CartSchema);

module.exports = {Admin, Category, Customer, Product, Order, Cart};
const express = require('express');
const router = express.Router();

// Utils
const JwtUtil = require('../utils/JwtUtil');
const EmailUtil = require('../utils/EmailUtil');

// DAOs
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require('../models/OrderDAO');
const CustomerDAO = require('../models/CustomerDAO');
const mongoose = require('mongoose');

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password required' });
        }

        const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = JwtUtil.genToken(username, password);
        res.json({ success: true, message: 'Authentication successful', token });
    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.get('/token', JwtUtil.checkToken, function (req, res) {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    res.json({ success: true, message: 'Token is valid', token: token });
});

// Category
router.get('/categories', JwtUtil.checkToken, async function (req, res) {
    const categories = await CategoryDAO.selectAll();
    res.json(categories);
});

router.post('/categories', JwtUtil.checkToken, async function (req, res) {
    const name = req.body.name;
    const category = { name: name };
    const result = await CategoryDAO.insert(category);
    res.json(result);
});

router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
    const _id = req.params.id;
    const name = req.body.name;
    const category = { _id: _id, name: name };
    const result = await CategoryDAO.update(category);
    res.json(result);
});

router.delete('/categories/:id', JwtUtil.checkToken, async function(req, res) {
    const _id = req.params.id;
    const result = await CategoryDAO.delete(_id);
    res.json(result);
});

// Product
router.get('/products', JwtUtil.checkToken, async function (req, res) {
    var products = await ProductDAO.selectAll();
    const sizePage = 4;
    const noPages = Math.ceil(products.length / sizePage);
    var curPage = 1;
    if (req.query.page) curPage = parseInt(req.query.page);
    const offset = (curPage - 1) * sizePage;
    products = products.slice(offset, offset + sizePage);
    const result = { products: products, noPages: noPages, curPage: curPage };
    res.json(result);
});

router.post('/products', JwtUtil.checkToken, async function (req, res) {
    const name = req.body.name;
    const price = req.body.price;
    const cid = req.body.category;
    const image = req.body.image;
    const now = new Date().getTime();
    const category = await CategoryDAO.selectByID(cid);
    const product = { name: name, price: price, image: image, cdate: now, category: category };
    const result = await ProductDAO.insert(product);
    res.json(result);
});

router.put('/products/:id', JwtUtil.checkToken, async function (req, res) {
    const _id = req.params.id;
    const name = req.body.name;
    const price = req.body.price;
    const cid = req.body.category;
    const image = req.body.image;
    const now = new Date().getTime();
    const category = await CategoryDAO.selectByID(cid);
    const product = { _id: _id, name: name, price: price, image: image, cdate: now, category: category };
    const result = await ProductDAO.update(product);
    res.json(result);
});

router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
    const _id = req.params.id;
    const result = await ProductDAO.delete(_id);
    res.json(result);
});

// Orders
router.get("/orders", JwtUtil.checkToken, async (req, res) => {
    try {
        console.log("Fetching orders for admin");
        const orders = await OrderDAO.find();
        console.log("Fetched all orders:", orders);
        res.json(orders || []);
    } catch (error) {
        console.error("Error fetching orders:", error.message, error.stack);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

router.patch("/orders/:id", JwtUtil.checkToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid order ID" });
        }
        if (!status || !["Pending", "Approved", "Shipped", "Delivered", "Cancelled"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }
        console.log(`Updating order ${id} to status: ${status}`);
        const order = await OrderDAO.updateOrderStatus(id, status);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json({ message: "Order status updated", order });
    } catch (error) {
        console.error("Error updating order status:", error.message, error.stack);
        res.status(500).json({ error: "Failed to update order status" });
    }
});

// Customer
router.get('/customers', JwtUtil.checkToken, async function (req, res) {
    const customers = await CustomerDAO.selectAll();
    res.json(customers);
});

router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
    const _id = req.params.id;
    const token = req.body.token;
    const result = await CustomerDAO.active(_id, token, 0);
    res.json(result);
});

router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
    const _id = req.params.id;
    const cust = await CustomerDAO.selectByID(_id);
    if (cust) {
        const send = await EmailUtil.send(cust.email, cust._id, cust.token);
        if (send) {
            res.json({ success: true, message: 'Please check email' });
        } else {
            res.json({ success: false, message: 'Email failure' });
        }
    } else {
        res.json({ success: false, message: 'Not exists customer' });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Utils
const CryptoUtil = require('../utils/CryptoUtil');
const JwtUtil = require('../utils/JwtUtil');
const EmailUtil = require('../utils/EmailUtil');

// DAOs
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const CustomerDAO = require('../models/CustomerDAO');
const OrderDAO = require("../models/OrderDAO");
const CartDAO = require("../models/CartDAO");
const { Customer } = require("../models/Models");

// Category
router.get('/categories', async function (req, res) {
    const categories = await CategoryDAO.selectAll();
    res.json(categories);
});

// Product
router.get('/products/new', async function (req, res) {
    const products = await ProductDAO.selectTopNew(3);
    res.json(products);
});

router.get('/products/hot', async function (req, res) {
    const products = await ProductDAO.selectTopHot(3);
    res.json(products);
});

router.get('/products/category/:cid', async function (req, res) {
    const _cid = req.params.cid;
    const products = await ProductDAO.selectByCatID(_cid);
    res.json(products);
});

router.get('/products/search/:keyword', async function (req, res) {
    const keyword = req.params.keyword;
    const products = await ProductDAO.selectByKeyword(keyword);
    res.json(products);
});

router.get('/products/:id', async function (req, res) {
    const _id = req.params.id;
    const product = await ProductDAO.selectByID(_id);
    res.json(product);
});

// Middleware to verify customer token
const verifyCustomer = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7);
        }
        if (!token) {
            console.log("No token provided");
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = JwtUtil.verifyToken(token);
        console.log("Decoded token:", decoded);
        if (!decoded.username || typeof decoded.username !== 'string') {
            return res.status(401).json({ message: "Invalid token payload" });
        }
        const customer = await Customer.findOne({ username: decoded.username });
        if (!customer) {
            console.log("Customer not found for username:", decoded.username);
            return res.status(404).json({ message: "Customer not found" });
        }
        console.log("Customer found:", customer._id);
        if (!mongoose.Types.ObjectId.isValid(customer._id)) {
            return res.status(500).json({ message: "Invalid customer ID" });
        }
        req.customer = customer;
        next();
    } catch (error) {
        console.error("Verify error:", error);
        res.status(401).json({ message: `Invalid token: ${error.message}` });
    }
};

// Register a new customer
router.post('/register', async (req, res) => {
    try {
        const { username, password, name, phone, email } = req.body;
        console.log("Register attempt:", { username, email });
        if (!username || !password || !email) {
            console.log("Missing required fields:", { username, password, email });
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const existingCustomer = await CustomerDAO.selectByUsernameOrEmail(username, email);
        if (existingCustomer) {
            console.log("Existing customer found:", { username, email });
            return res.status(400).json({ success: false, message: 'Username or email already exists' });
        }

        const hashedPassword = CryptoUtil.md5(password);
        console.log("Password hashed");
        const token = JwtUtil.genToken(username);
        console.log("Token generated:", token);

        const newCustomer = {
            _id: new mongoose.Types.ObjectId(), // Already added
            username,
            password: hashedPassword,
            name,
            phone,
            email,
            active: 0,
            token,
        };
        console.log("New customer data:", JSON.stringify(newCustomer, null, 2));

        const result = await CustomerDAO.insert(newCustomer);
        if (!result) {
            console.log("Customer insert failed");
            return res.status(500).json({ success: false, message: 'Failed to create customer' });
        }
        console.log("Customer inserted:", JSON.stringify(result, null, 2));

        const send = await EmailUtil.send(email, result._id, token);
        if (send) {
            console.log("Email sent to:", email);
            return res.status(201).json({ success: true, message: 'Please check email!' });
        } else {
            console.log("Email send failed for:", email);
            return res.status(500).json({ success: false, message: 'Send email failed!' });
        }
    } catch (error) {
        console.error("Register error:", error.message, error.stack);
        res.status(500).json({ success: false, message: `Failed to register: ${error.message}` });
    }
});

// Login customer
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password required' });
        }
        const hashedPassword = CryptoUtil.md5(password);
        const customer = await CustomerDAO.selectByUsernameAndPassword(username, hashedPassword);
        if (!customer) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = JwtUtil.genToken(username);
        res.json({
            success: true,
            message: 'Authentication successful',
            token,
            customer: {
                _id: customer._id,
                username: customer.username,
                name: customer.name,
                phone: customer.phone,
                email: customer.email,
                active: customer.active
            }
        });
    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
    }
});

// Activate account
router.post('/activate', async (req, res) => {
    try {
        const { _id, token } = req.body;
        const result = await CustomerDAO.active(_id, token, 1);
        if (!result) {
            return res.status(400).json({ message: 'Invalid activation details' });
        }
        res.status(200).json({ message: 'Account activated successfully' });
    } catch (error) {
        console.error("Activate error:", error);
        res.status(500).json({ message: `Failed to activate: ${error.message}` });
    }
});

// Profile route
router.get("/profile", verifyCustomer, async (req, res) => {
    try {
        console.log("Fetching profile for customer:", req.customer._id);
        res.json({
            _id: req.customer._id,
            username: req.customer.username,
            name: req.customer.name,
            phone: req.customer.phone,
            email: req.customer.email,
            active: req.customer.active
        });
    } catch (error) {
        console.error("Fetch profile failed:", error);
        res.status(500).json({ message: `Failed to fetch profile: ${error.message}` });
    }
});

// Profile by ID (kept for compatibility)
router.get("/profile/:id", verifyCustomer, async (req, res) => {
    try {
        console.log("Fetching profile for id:", req.params.id);
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid customer ID" });
        }
        if (req.params.id !== req.customer._id.toString()) {
            return res.status(403).json({ message: "Unauthorized access" });
        }
        const customer = await CustomerDAO.selectByID(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.json({
            _id: customer._id,
            username: customer.username,
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            active: customer.active
        });
    } catch (error) {
        console.error("Fetch customer failed:", error);
        res.status(500).json({ message: `Failed to fetch customer: ${error.message}` });
    }
});

// Get customer cart
router.get("/cart", verifyCustomer, async (req, res) => {
    try {
        console.log("Fetching cart for customerId:", req.customer._id);
        const cart = await CartDAO.getCart(req.customer._id);
        res.json(cart || { items: [] });
    } catch (error) {
        console.error("Fetch cart failed:", error);
        res.status(500).json({ message: `Failed to fetch cart: ${error.message}` });
    }
});

// Update cart
router.post("/cart", verifyCustomer, async (req, res) => {
    try {
        const { items } = req.body;
        const updatedCart = await CartDAO.updateCart(req.customer._id, items);
        res.json(updatedCart);
    } catch (error) {
        console.error("Update cart failed:", error);
        res.status(500).json({ message: `Failed to update cart: ${error.message}` });
    }
});

// Clear cart
router.delete("/cart", verifyCustomer, async (req, res) => {
    try {
        const result = await CartDAO.clearCart(req.customer._id);
        if (result) {
            res.json({ message: "Cart cleared successfully" });
        } else {
            res.status(404).json({ message: "Cart not found" });
        }
    } catch (error) {
        console.error("Clear cart failed:", error);
        res.status(500).json({ message: `Failed to clear cart: ${error.message}` });
    }
});

// Sync cart
router.post("/cart/sync", verifyCustomer, async (req, res) => {
    try {
        const { items } = req.body;
        console.log("Received sync items for customer:", req.customer._id, "Items:", items);
        const syncedCart = await CartDAO.syncCart(req.customer._id, items);
        res.json(syncedCart || { items: [] });
    } catch (error) {
        console.error("Sync cart failed:", error);
        res.status(500).json({ message: `Failed to sync cart: ${error.message}` });
    }
});

// Create order
router.post("/orders", verifyCustomer, async (req, res) => {
    try {
        const { items, total } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Invalid or empty items" });
        }
        for (const item of items) {
            if (!mongoose.Types.ObjectId.isValid(item.productId)) {
                return res.status(400).json({ message: `Invalid productId: ${item.productId}` });
            }
        }
        const newOrder = {
            _id: new mongoose.Types.ObjectId(),
            cdate: Date.now(),
            total,
            status: "Pending",
            customer: {
                _id: req.customer._id,
                username: req.customer.username,
                name: req.customer.name,
                phone: req.customer.phone,
                email: req.customer.email,
                active: req.customer.active,
                token: req.customer.token
            },
            items: items.map(item => ({
                product: {
                    _id: new mongoose.Types.ObjectId(item.productId),
                    name: item.name,
                    price: item.price,
                    image: "",
                    cdate: Date.now(),
                    category: {}
                },
                quantity: item.quantity
            }))
        };
        const result = await OrderDAO.createOrder(newOrder);
        if (!result) {
            return res.status(500).json({ message: "Failed to create order" });
        }
        res.status(201).json({ message: "Order placed successfully", order: result });
    } catch (error) {
        console.error("Order creation failed:", error);
        res.status(500).json({ message: `Failed to place order: ${error.message}` });
    }
});

// Get customer orders
router.get("/orders", verifyCustomer, async (req, res) => {
    try {
        console.log("Fetching orders for customerId:", req.customer._id);
        const orders = await OrderDAO.getOrdersByCustomer(req.customer._id);
        res.json(orders);
    } catch (error) {
        console.error("Fetch orders failed:", error);
        res.status(500).json({ message: `Failed to fetch orders: ${error.message}` });
    }
});

module.exports = router;
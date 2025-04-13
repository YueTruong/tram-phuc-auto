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

// Register a new customer
router.post('/register', async (req, res) => {
    try {
        const { username, password, name, phone, email } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        const existingCustomer = await CustomerDAO.selectByUsernameOrEmail(username, email);
        if (existingCustomer) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        const hashedPassword = CryptoUtil.md5(password);
        const token = JwtUtil.genToken(username);
        const newCustomer = {
            username,
            password: hashedPassword,
            name,
            phone,
            email,
            active: 0,
            token,
        };
        const result = await CustomerDAO.insert(newCustomer);
        if (result) {
            const send = await EmailUtil.send(email, result._id, token);
            if (send) {
                return res.json({ success: true, message: 'Please check email!' });
            } else {
                return res.json({ success: false, message: 'Send email failed!' });
            }
        } else {
            return res.json({ success: false, message: 'Register failed!' });
        }
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: `Failed to register: ${error.message}` });
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
        res.json({ success: true, message: 'Authentication successful', token });
    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
    }
});

router.get('/token', JwtUtil.checkToken, function (req, res) {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    res.json({ success: true, message: 'Token is valid', token: token });
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

router.get("/me", JwtUtil.checkToken, async (req, res) => {
    try {
        const customer = await Customer.findOne({ username: req.user.username }).select("-password");
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        console.log("Server response:", customer);
        res.json(customer);
    } catch (error) {
        console.error("Fetch me failed:", error);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
});

// Get all customers
router.get('/', async (req, res) => {
    try {
        const customers = await CustomerDAO.selectAll();
        res.status(200).json(customers);
    } catch (error) {
        console.error("Fetch all customers failed:", error);
        res.status(500).json({ message: `Failed to fetch customers: ${error.message}` });
    }
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
        await CartDAO.clearCart(req.customer._id);
        res.json({ message: "Cart cleared" });
    } catch (error) {
        console.error("Clear cart failed:", error);
        res.status(500).json({ message: `Failed to clear cart: ${error.message}` });
    }
});

// Sync cart
router.post("/cart/sync", verifyCustomer, async (req, res) => {
    try {
        const { items } = req.body;
        const syncedCart = await CartDAO.syncCart(req.customer._id, items);
        res.json(syncedCart);
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

// Get customer by ID (moved below specific routes)
router.get("/customer/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid customer ID" });
        }
        const customer = await CustomerDAO.selectByID(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json(customer);
    } catch (error) {
        console.error("Fetch customer failed:", error);
        res.status(500).json({ message: `Failed to fetch customer: ${error.message}` });
    }
});

// Update customer
router.put("/customer/:id", async (req, res) => {
    try {
        const { username, password, name, phone, email } = req.body;
        const updatedCustomer = {
            _id: req.params.id,
            username,
            password: password ? CryptoUtil.md5(password) : undefined,
            name,
            phone,
            email
        };
        const result = await CustomerDAO.update(updatedCustomer);
        if (!result) {
            return res.status(400).json({ message: "Update failed" });
        }
        res.status(200).json({ message: "Customer updated successfully", customer: result });
    } catch (error) {
        console.error("Update customer failed:", error);
        res.status(500).json({ message: `Failed to update customer: ${error.message}` });
    }
});

// Profile route
router.get("/profile/:id", verifyCustomer, async (req, res) => {
    try {
        console.log("Fetching profile for id:", req.params.id);
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid customer ID" });
        }
        const customer = await CustomerDAO.selectByID(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.json(customer);
    } catch (error) {
        console.error("Fetch customer failed:", error);
        res.status(500).json({ message: `Failed to fetch customer: ${error.message}` });
    }
});

module.exports = router;
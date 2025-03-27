const express = require('express');
const router = express.Router();

//Utils
const CryptoUtil = require('../utils/CryptoUtil');
const JwtUtil = require('../utils/JwtUtil');
const EmailUtil = require('../utils/EmailUtil');

//DAOs
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const CustomerDAO = require('../models/CustomerDAO');
const OrderDAO = require("../models/OrderDAO");
const CartDAO = require("../models/CartDAO");
const {Customer} = require("../models/Models");

//Category
router.get('/categories', async function (req, res) {
    const categories = await CategoryDAO.selectAll();
    res.json(categories);
});

//Product
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
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if username or email already exists
        const existingCustomer = await CustomerDAO.selectByUsernameOrEmail(username, email);
        if (existingCustomer) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash password and create new customer
        const hashedPassword = CryptoUtil.md5(password);

        // Generate token
        const token = JwtUtil.genToken(username, password);

        const newCustomer = {
            username,
            password: hashedPassword,
            name,
            phone,
            email,
            active: 0, // Default inactive
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
        res.status(500).json({ message: error.message });
    }
});

// Login customer
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Hash password and find user
        const hashedPassword = CryptoUtil.md5(password);
        const customer = await CustomerDAO.selectByUsernameAndPassword(username, hashedPassword);

        if (!customer) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        if (customer.active === 0) {
            return res.status(403).json({ message: 'Account is not activated' });
        }

        const token = JwtUtil.genToken(username, customer.password);
        res.status(200).json({ message: 'Login successful', token, customer });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
    }
});

router.get("/me", JwtUtil.checkToken, async (req, res) => {
    try {
        const customer = await Customer.findOne({ username: req.user.username }).select("-password");
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        console.log("Server response:", customer); // Kiểm tra dữ liệu trên server
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get all customers
router.get('/', async (req, res) => {
    try {
        const customers = await CustomerDAO.selectAll();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get customer by ID
router.get('/:id', async (req, res) => {
    try {
        const customer = await CustomerDAO.selectByID(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update customer
router.put('/:id', async (req, res) => {
    try {
        const { username, password, name, phone, email } = req.body;
        const updatedCustomer = {
            _id: req.params.id,
            username,
            password: CryptoUtil.md5(password),
            name,
            phone,
            email
        };

        const result = await CustomerDAO.update(updatedCustomer);
        if (!result) {
            return res.status(400).json({ message: 'Update failed' });
        }

        res.status(200).json({ message: 'Customer updated successfully', customer: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Middleware kiểm tra đăng nhập
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = JwtUtil.checkToken(token);
        req.customer = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Order
router.post("/order", authenticate, async (req, res) => {
    try {
        const { items, total } = req.body;
        const newOrder = {
            customer: req.customer._id,
            items,
            total,
            status: "Pending",
            cdate: new Date(),
        };

        const result = await OrderDAO.createOrder(newOrder);
        res.status(201).json({ success: true, message: "Order placed successfully!", order: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Order history
router.get("/orders", authenticate, async (req, res) => {
    try {
        const orders = await OrderDAO.getOrdersByCustomer(req.customer._id);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Middleware to verify customer token
const verifyCustomer = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = JwtUtil.verifyToken(token);
        const customer = await Customer.findOne({ username: decoded.username });

        if (!customer) return res.status(404).json({ message: "Customer not found" });

        req.customer = customer;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Get customer cart
router.get("/cart", verifyCustomer, async (req, res) => {
    try {
        const cart = await CartDAO.getCart(req.customer._id);
        res.json(cart || { items: [] });
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart" });
    }
});

// Update cart
router.post("/cart", verifyCustomer, async (req, res) => {
    try {
        const { items } = req.body;
        const updatedCart = await CartDAO.updateCart(req.customer._id, items);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: "Error updating cart" });
    }
});

// Clear cart
router.delete("/cart", verifyCustomer, async (req, res) => {
    try {
        await CartDAO.clearCart(req.customer._id);
        res.json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ message: "Error clearing cart" });
    }
});

module.exports = router;
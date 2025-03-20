const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//DAOs
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');

// Middleware
const Customer = require("../models/Models").Customer;
const EmailUtil = require("../utils/EmailUtil");
const MyConstants = require("../utils/MyConstants");

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

// Generate JWT token
const genToken = (customer) => {
    return jwt.sign(
        { id: customer._id, username: customer.username },
        MyConstants.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

// 📌 1. Register Customer
router.post("/signup", async (req, res) => {
    const { username, password, name, phone, email } = req.body;

    try {
        const existingCustomer = await Customer.findOne({ username });
        if (existingCustomer) return res.status(400).json({ message: "Username already taken" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newCustomer = new Customer({
            _id: new mongoose.Types.ObjectId(),
            username,
            password: hashedPassword,
            name,
            phone,
            email,
            active: 0,
            token: genToken({ username })
        });

        await newCustomer.save();

        // Send activation email
        const activationLink = `${MyConstants.CLIENT_URL}/activate/${newCustomer._id}`;
        await EmailUtil.send(email, "Account Activation", `Click to activate: ${activationLink}`);

        res.status(201).json({ message: "Customer registered. Check email to activate account." });
    } catch (error) {
        res.status(500).json({ message: "Error signing up", error });
    }
});

// 📌 2. Activate Customer
router.get("/activate/:id", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: "Invalid activation link" });

        customer.active = 1;
        await customer.save();
        res.json({ message: "Account activated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Activation failed", error });
    }
});

// 📌 3. Login Customer
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const customer = await Customer.findOne({ username });
        if (!customer) return res.status(404).json({ message: "User not found" });

        if (!customer.active) return res.status(403).json({ message: "Account not activated" });

        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = genToken(customer);
        res.json({ message: "Login successful", token, customer });
    } catch (error) {
        res.status(500).json({ message: "Login error", error });
    }
});

module.exports = router;
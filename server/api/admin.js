const express = require('express');
const router = express.Router();

//Utils
const JwtUtil = require('../utils/JwtUtil');

//DAOs
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');

//Login
router.post('/login', async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
        if (admin) {
            const token = JwtUtil.genToken();
            res.json({success: true, message: 'Authentication successful', token: token});
        } else {
            res.json({success: false, message: 'Incorrect username or password'});
        }
    } else {
        res.json({success: false, message: 'Please input username and password'});
    }
});

router.get('/token', JwtUtil.checkToken, function (req, res) {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    res.json({success: true, message: 'Token is valid', token: token});
});

//Category
router.get('/categories', JwtUtil.checkToken, async function (req, res) {
    const categories = await CategoryDAO.selectAll();
    res.json(categories);
});

router.post('/categories', JwtUtil.checkToken, async function (req, res) {
    const name = req.body.name;
    const category = {name: name};
    const result = await CategoryDAO.insert(category);
    res.json(result);
});

router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
      const _id = req.params.id;
      const name = req.body.name;
      const category = {_id: _id, name: name};
      const result = await CategoryDAO.update(category);
      res.json(result);
});

router.delete('/categories/:id', JwtUtil.checkToken, async function(req, res) {
    const _id = req.params.id;
    const result = await CategoryDAO.delete(_id);
    res.json(result);
});

//Product
router.get('/products', JwtUtil.checkToken, async function (req, res) {
    //Get data
    var products = await ProductDAO.selectAll();
    //Pagination
    const sizePage = 4;
    const noPages = Math.ceil(products.length / sizePage);
    var curPage = 1;
    if (req.query.page) curPage = parseInt(req.query.page); // /products?page=xxx
    const offset = (curPage- 1) * sizePage;
    products = products.slice(offset, offset + sizePage);
    //Return
    const result = { products: products, noPages: noPages, curPage: curPage };
    res.json(result);
});

router.post('/products', JwtUtil.checkToken, async function (req, res) {
    const name = req.body.name;
    const price = req.body.price;
    const cid = req.body.category;
    const image = req.body.image;
    const now = new Date().getTime(); //Milliseconds
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
    const now = new Date().getTime(); //Milliseconds
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
module.exports = router;
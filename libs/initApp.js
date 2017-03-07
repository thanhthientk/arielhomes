"use strict";

const express = require('express');
const Router = express.Router();

const User = G_loadModel('user');
const Branch = G_loadModel('branch');
const Counter = require('../features/counter/model/index.model');
const Customer = G_loadModel('customer');
const Product = G_loadModel('product');
const Role = G_loadModel('role');
const Taxonomy = G_loadModel('taxonomy');

const users = require('./hoadon-db/users.json');
const branches = require('./hoadon-db/branches.json');
const counters = require('./hoadon-db/counters.json');
const customers = require('./hoadon-db/customers.json');
const products = require('./hoadon-db/products.json');
const roles = require('./hoadon-db/roles.json');
const taxonomies = require('./hoadon-db/taxonomies.json');

Router.get('/init', function (req, res, next) {
    User.collection.insertMany(users)
        .then(users => {
            res.send(users);
        })
        .catch(err => next(err))
});


module.exports = Router;
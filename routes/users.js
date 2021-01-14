const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const UsersModel = require('../models/users');
const checkRole = require('../helpers/checkRole');
const roles = require('../config/roles');

let router = express.Router();

router.delete('/:id', (req, res, next) => checkRole(req, res, next, [roles.ADMIN]), (req, res) => {
    UsersModel.findOneAndDelete()
})

router.put('/:id', (req, res, next) => checkRole(req, res, next, [roles.ADMIN]), (req, res) => {
    UsersModel.findOneAndUpdate({_id: req.params.id}, req.body.user, (err, user) => {
        if(err) throw err;
        else res.status(200).send(user);
    })
})

router.get('/',(req, res, next) => checkRole(req, res, next, [roles.ADMIN, roles.MODERATOR]), (req, res) => {
    UsersModel.find({}, (err, users) => {
        if(err) throw err;
        else res.status(200).json({users});
    })
})

module.exports = router;
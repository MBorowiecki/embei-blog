const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const UserModel = require('../models/users');
const checkRole = require('../helpers/checkRole');
const roles = require('../config/roles');

let router = express.Router();

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if(email && password){
        UserModel.findOne({'email': email}, (err, user) => {
            if(err) throw err;
            else{
                if(user){
                    bcrypt.compare(password, user.password, (err, same) => {
                        if(err) throw err;
                        if(same){
                            const token = jwt.sign({
                                name: user.name,
                                email: user.email,
                                role: user.role,
                                password: user.password,
                                avatarName: user.avatarName
                            }, process.env.JWT_SECRET, {
                                expiresIn: 1200
                            });

                            res.header("Access-Control-Allow-Origin", "*");
                            res.status(200).json({
                                name: user.name,
                                email: user.email,
                                role: user.role,
                                token: token,
                                avatarName: user.avatarName
                            });
                        }
                    })
                }else{
                    res.header("Access-Control-Allow-Origin", "*");
                    res.status(401).json({'msg': 'No user with this email'})
                }
            }
        })
    }
})

router.post('/register', (req, res, next) => checkRole(req, res, next, [roles.ADMIN]), (req, res) => {
    const { name, email, password, role } = req.body;

    if(name, email, password){
        UserModel.findOne({email}, (err, user) => {
            if(err) throw err;
            if(user){
                res.status(401).json({'msg': 'User with this email exist'})
            }else{
                const hashedPassword = bcrypt.hashSync(password, 10);

                const newUser = new UserModel({
                    name,
                    email,
                    password: hashedPassword,
                    createdAt: Date.now(),
                    role: role || "user"
                })

                newUser.save(err => {
                    if(err) throw err;
                    else{
                        res.status(200).json(newUser);
                    }
                })
            }
        })
    }
})

router.post('/check', (req, res) => {
    const { email, token } = req.body;

    if(email && token){
        UserModel.findOne({email}, (err, user) => {
            if(err) throw err;

            if(!user){
                res.status(403).json({msg: 'No user data found!'});
            }else{
                const sentUserData = jwt.decode(token);
                if(sentUserData.password === user.password && Date.now() <= sentUserData.exp * 1000){
                    const token = jwt.sign({
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        password: user.password
                    }, process.env.JWT_SECRET, {
                        expiresIn: 1200
                    });
                    res.status(200).json({token});
                }else{
                    res.status(200).json({token: false});
                }
            }
        })
    }
})

module.exports = router;
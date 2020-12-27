const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();

const checkRole = (req, res, next, roles) => {
    const { token } = req.body;

    let userProfile = jwt.decode(token);

    if(roles.includes(userProfile.role)){
        next();
    }else{
        res.status(401).json({msg: 'Not authorized!'});
    }
}

module.exports = checkRole;
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();

const checkRole = (req, res, next, roles) => {
    const { token } = req.body;
    const hToken = req.headers.authorization;

    let userProfile;

    if(token){
        userProfile = jwt.decode(token);
    }else{
        if(hToken){
            userProfile = jwt.decode(hToken);
        }else{
            res.status(401).json({msg: 'Not authorized!'});
        }
    }

    if(roles.includes(userProfile.role)){
        next();
    }else{
        res.status(401).json({msg: 'Not authorized!'});
    }
}

module.exports = checkRole;
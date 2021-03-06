const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');

const PostsModel = require('../models/posts');
const checkRole = require('../helpers/checkRole');

let router = express.Router();
const upload = multer({dest: 'uploads/'});

router.post('/upload', (req, res, next) => checkRole(req, res, next, ['admin', 'moderator']), upload.single('image'), (req, res) => {
    fs.rename(req.file.path, `${req.file.destination}${req.file.originalname}`, (err) => {
        if(err) throw err;
        else {
            res.status(200).json({...req.file, path: `${req.file.destination}${req.file.originalname}`})
        };
    });
})

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const _id = mongoose.Types.ObjectId(id);

    PostsModel.findOne({_id}, (err, post) => {
        if(err) throw err;
        else{
            if(post){
                res.status(200).send(post);
            }else{
                res.status(404).json({msg: `No post with id ${id}`})
            }
        }
    })
})

router.put('/:id', (req, res, next) => checkRole(req, res, next, ['admin', 'moderator', 'redactor']), (req, res) => {
    const { post } = req.body;
    const { id } = req.params;
    
    PostsModel.findOneAndUpdate({_id: id}, post, {new: true}, (err, _post) => {
        if(err) throw err;
        else{
            res.status(200).send(_post);
        }
    })
})

router.post('/delete/:id', (req, res, next) => checkRole(req, res, next, ['admin']), (req, res) => {
    const { id } = req.params;

    if(id){
        PostsModel.findByIdAndRemove(id, (err, post) => {
            if(err) throw err;
            else{
                res.status(200).send(post);
            }
        })
    }
})

router.post('/', (req, res, next) => checkRole(req, res, next, ['admin', 'moderator', 'redactor']), (req, res) => {
    const { title, body, token, imagePath } = req.body;

    if(title && body && token){
        const userMeta = jwt.decode(token);
        
        const newPost = new PostsModel({
            title,
            body,
            imagePath,
            author: userMeta.name
        })

        newPost.save(err => {
            if(err) throw err;
            else{
                res.status(200).send(newPost);
            }
        })
    }
})

router.get('/', (req, res) => {
    PostsModel.find({}, (err, posts) => {
        if(err) throw err;
        else {
            res.status(200).send(posts);
        }
    })
})

module.exports = router;
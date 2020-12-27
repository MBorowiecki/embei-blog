const mongoose = require('mongoose');

const PostsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    comments: {
        type: Array,
        default: []
    },
    likes: {
        type: Number,
        default: 0
    }
})

const PostsModel = mongoose.model('posts', PostsSchema);

module.exports = PostsModel;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const APIVersion = 'v1';

const postsRouter = require('./routes/posts');
const authRouter = require('./routes/authentication');
const usersRouter = require('./routes/users');
const { username, password, host, dbName } = require('./config/db');

mongoose.connect(`mongodb+srv://${username}:${password}@${host}/${dbName}?retryWrites=true&w=majority`, err => {
    if(err) console.log(err);
    else console.log('Connected to database!');
})

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

app.use(`/api/${APIVersion}/posts/`, postsRouter);
app.use(`/api/${APIVersion}/auth/`, authRouter);
app.use(`/api/${APIVersion}/users`, usersRouter);

app.get(`/api/${APIVersion}/uploads/:name`, (req, res) => {
    if(req.params.name){
        res.status(200).sendFile(path.resolve(`uploads/${req.params.name}`))
    }
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
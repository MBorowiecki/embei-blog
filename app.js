const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 6006;
const APIVersion = 'v1';

const postsRouter = require('./routes/posts');
const authRouter = require('./routes/authentication');
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
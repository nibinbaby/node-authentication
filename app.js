const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.static('public'));
app.use(express.json);


app.set('view engine', 'ejs');

const dbURI = 'mongodb+srv://<username>:<password>@nibin.bzqmvb3.mongodb.net/node-auth?retryWrites=true&w=majority';

mongoose.connect(dbURI, {})
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));


app.get('/', (req, res) =>res.render('home'));
app.get('/smoothies', (req, res) =>res.render('smoothies'));

app.use(authRoutes);
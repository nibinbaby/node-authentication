const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const credentials = require('./creds.json');
const cookie_parser = require('cookie-parser');

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cookie_parser())


app.set('view engine', 'ejs');

const dbURI = `mongodb+srv://${credentials.username}:${credentials.password}@nibin.bzqmvb3.mongodb.net/node-auth?retryWrites=true&w=majority`;

mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));


app.get('/', (req, res) =>res.render('home'));
app.get('/smoothies', (req, res) =>res.render('smoothies'));

app.use(authRoutes);


app.get('/set-cookies', (req, res) =>{
    // res.setHeader('Set-cookie', 'newUser=true');
    // the 3rd argument is optional :
    // it can be maxage for exipiration
    // secure, for https sites only
    // httpOnly, to diable the access of cookie through javascript i.e. document.cookie is not gonna give the value
    res.cookie('newUser', false, {maxAge: 1000*60*60*24, httpOnly: true})
    res.send('cookies set');
})



app.get('/read-cookies', (req, res) =>{

    const cookies = req.cookies;
    res.json(cookies);
    
})
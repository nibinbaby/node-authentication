const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const credentials = require('../creds.json');

// handle errors 

const handleErrors = (err) => {
    // console.log(err.message, err.code);
    let errors = {email: '', password: ''};

    // unique email errors
    
    if(err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    // validation errors

    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }

    // incorrect email
    if(err.message === 'incorrect email'){
        errors.email = 'that email is not registered'
    }

    // incorrect password
    if(err.message === 'incorrect password'){
        errors.password = 'that password is incorrect'
    }

    return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, credentials.secret, {
        expiresIn: maxAge
    })
}

const signup_get = (req, res) => {
    res.render('signup');
}

const login_get = (req, res) => {
    res.render('login');
}

const signup_post = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.create({
            email, password
        });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
        res.status(200).json({user: user._id});
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({errors});
    }
}

const login_post = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
        res.status(200).json({user: user._id});
    } catch (error) {
        const errors = handleErrors(error)
        res.status(400).json({ errors })
    }
}

const logout_get = async(req, res) => {
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/');
}



module.exports = {
    signup_get,
    login_get,
    signup_post,
    login_post,
    logout_get
}
const User = require('../models/Users');
const jwt = require('jsonwebtoken');

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

    return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, 'secret key', {
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

const login_post = (req, res) => {
    const {email, password} = req.body;
    console.log(email, password)
    res.send('user login');
}

module.exports = {
    signup_get,
    login_get,
    signup_post,
    login_post
}
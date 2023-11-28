const User = require('../models/Users');

// handle errors 

const handleErrors = (err) => {
    console.log(err.message, err.code);
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
        res.status(200).json(user);
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
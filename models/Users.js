const mongoose = require('mongoose');

const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        required: [true, 'please enter an email'],
        type: String,
        unique: true,
        lowercase: true,
        validate: [isEmail, 'please enter a valid email']
    },
    password: {
        required: [true, 'please enter an password'],
        type: String,
        minlength: [6, 'minimum password length is 6 characters']
    }
});

const User = mongoose.model('user', userSchema);

module.exports = User;
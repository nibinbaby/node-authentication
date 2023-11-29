const mongoose = require('mongoose');

const { isEmail } = require('validator');

const bcrypt = require('bcrypt');

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

// fire a function after a document is saved to db: mongoose hook
userSchema.post('save', function(doc, next) { 
    console.log('document saved to db', doc)
    // to continue the middleware to cater the request
    next();
})

// fire a function before a document is saved to db: mongoose hook
userSchema.pre('save', async function(next) { 
    // we will need a 'salt' string to be added to the password and then it is hashed and saved to the db
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    // 'this.' is accessible here, it refers to the model instant called in the doc saving post method
    console.log('about to be created and saved', this)
    // to continue the middleware to cater the request
    next();
})

const User = mongoose.model('user', userSchema);

module.exports = User;
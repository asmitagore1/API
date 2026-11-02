const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    match: [/^\S+$/, 'Username cannot contain spaces']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  phone_number: {
    type: String,
    required: [true, 'Phone number is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [15, 'Password must be at least 15 characters long'],
    validate: {
      validator: function(v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{15,}$/.test(v);
      },
      message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character.'
    }
  },
  profile: {
    bio: String,
    avatar: String,
    address: String
  }
}, { timestamps: true });

// Modern Mongoose async pre-save hook (returns promise, no 'next' callback needed)
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password method for login
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

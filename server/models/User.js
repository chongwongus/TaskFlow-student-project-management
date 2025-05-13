const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    minlength: 6,
    select: false
  },
  googleId: String,
  avatar: String,
  githubUsername: String,
  githubToken: {
    type: String,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  lastActive: Date
}, {
  timestamps: true
});

// Hash password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// JWT
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '1d' }
  );
};

// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'assignedTo'
  });
  
  UserSchema.set('toObject', { virtuals: true });
  UserSchema.set('toJSON', { virtuals: true });
  
module.exports = mongoose.model('User', UserSchema);

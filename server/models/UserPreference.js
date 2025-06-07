const mongoose = require('mongoose');

const UserPreferenceSchema = new mongoose.Schema({
    googleId: String,
  theme: {
    type: String,
    required: [false, 'Theme is optional'],
    default: 'light',
    trim: true
  }
});

module.exports = mongoose.model('userPreference', UserPreferenceSchema);

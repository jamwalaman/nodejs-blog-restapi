const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
}, {
  timestamps: true,
  collation: {
    locale: 'en',
    strength: 1
    /*
    By default MongoDB document search is case sensitive. So username john isn't the same as johN
    "strength 1" means MongoDB will ignore case when matching
    */
  }
});

// Export model
module.exports = mongoose.model('User', UserSchema);

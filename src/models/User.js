import mongoose, { Schema, models } from 'mongoose';

const UserSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: true,
  },
  
  isAdmin: { 
    type: Boolean, 
    default: false,
  },
});

const User = models.User || mongoose.model('User', UserSchema);
export default User;

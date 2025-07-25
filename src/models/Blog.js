import mongoose, { Schema, models } from 'mongoose';

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  // The content is an array of blocks
  content: [
    {
      type: {
        type: String,
        required: true,
        enum: ['paragraph', 'image'], // Can only be a paragraph or an image
      },
      value: {
        type: String,
        required: true,
      },
    },
  ],
  author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
  }
}, {
  timestamps: true
});

const Blog = models.Blog || mongoose.model('Blog', BlogSchema);
export default Blog;
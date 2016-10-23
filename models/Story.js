const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = require('./User').schema;

const storySchema = new mongoose.Schema({
  author: { type: Schema.ObjectId, ref: 'User'},
  title: String,
  description: String,
  content: String,
  picture: String,
  funded: Number,
  fundingTarget: Number,
  backers: Number,
  likes: [{ type: Schema.ObjectId, ref: 'User'}],
  expires: Date,
  status: String
}, { timestamps: true });

storySchema.pre('save', function (next) {
    if (this.isNew) {
      var story = this;
      var nextMonth = new Date();
      nextMonth.setDate(nextMonth.getDate() + 30);
      
      story.expires = nextMonth;
    } 
    next();
});

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
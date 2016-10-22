const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = require('./User').schema;
const storySchema = new mongoose.Schema({
  author: { type: Schema.ObjectId, ref: 'User'},
  title: String,
  description: String,
  picture: String,
  funded: Number,
  backers: Number,
  expires: Date,
  comments: {
    author: { type: Schema.ObjectId, ref: 'User'},
    // replyTo: { type: Schema.ObjectId, ref: 'Comment'},
    addedOn: Date,
    text: String,
    files: [
      {
        originalFilename: String,
        filename: String,
      }
    ],
    replies: []
  },
  answers: [
    {
      author:{ type: Schema.ObjectId, ref: 'User'},
      text: String,
    files: [
      {
        originalFilename: String,
        filename: String,
      }
    ],
    replies: []
    }  
  ]
}, { timestamps: true });

storySchema.pre('save', function (next) { // create nu save! 

  const story = this;
  var nextMonth = new Date();
  nextMonth.setDate(nextMonth.getDate() + 30);
  
  story.expires = nextMonth;
  next();
  
});


const Story = mongoose.model('Story', storySchema);

module.exports = Story;
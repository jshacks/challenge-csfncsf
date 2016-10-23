const Story = require('../models/Story');
const User = require("../models/User");

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  Story.find({}, (err, docs) => {
    if (!err) {
      
      var vettedStories = docs.filter( (item) => {
        return item.status == 'vetted';
      });
      
      var financedStories =  docs.filter( (item) => {
        return item.status == 'financed';
      });
      
      var newStories =  docs.filter( (item) => {
        return !item.status || item.status == 'new';
      });
      
      res.render('home', {
        title: 'Home',
        vettedStories: vettedStories,
        financedStories: financedStories,
        newStories: newStories,
        messages: {
          errors: {}
        }
      });
    }
  });
};

exports.getSingle = (req, res) => {
  Story.findOne({_id:req.params.id}).exec((err, doc) => {
    if (!err) {
      User.findOne({_id:doc.author}).exec((err, user) => {
        if (!err) {
          doc.author=user;
          console.log(doc);
          res.render('single',
            {
              title: doc.title,
              story: doc,
            }
          );
        }
      });
    }
  });
};

exports.getList = (req, res) => { 
  Story.find({}, (err, docs) => {
    if (!err) {
      
      docs.map((item) => {
        
      });
      
      docs.forEach( (item, index) => {
        if (!err) {
          if (typeof item.status != 'undefined' && item.status != 'new')  {
            item.progress = Math.floor(item.funded / item.fundingTarget * 100);
          }
        }
      });
      
      res.render('multiple', {
        title: 'Descopera',
        stories: docs,
        messages: {
          errors: {}
        }
      });
    }
  });
};
exports.getAddStory = (req, res) => {
  res.render('add-story', {
    title: "Adauga o poveste"
  });
};

exports.postAddStory = (req, res) => {
  const story = new Story({
    author: req.user._id,
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    fundingTarget: req.body.fundingTarget,
  });
  story.save((err, story) => {
      if (err) { 
        req.flash('errors', { msg: 'Account with that email address already exists.' });
      }
      return res.redirect('/story/'+story._id);
  });
};

exports.getEditStory = (req, res) => {return ''  };
exports.postEditStory = (req, res) => { return '' };
exports.getDeleteStory = (req, res) => {return ''  };

exports.getVoteStory = (req, res) => {
  Story.findOne({_id:req.params.id}, (err, story) => {
    if (!err) {
      story.likes++;
      story.save();
      return res.redirect('/story/'+story._id);
    }
  });
}

exports.postFundStory = (req, res) => {
  Story.findOne({_id:req.params.id}, (err, story) => {
    if (!err) {
      story.funded = parseInt(story.funded) + parseInt(req.body.amount);
      story.backers++;
      story.save();
    }
  });
}
const Story = require('../models/Story');

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home',
    messages: {
      errors: {}
    }
  });
};

exports.getSingle = (req, res) => {
  var story = '';
  Story.findOne({_id:req.params.id}, (err, doc) => {
    if (!err) {
      console.log(doc);
      story = doc;
        res.render('single',
        {
          title: 'Story',
          story: story,
        }
      );
    }
  });
};

exports.getList = (req, res) => { return '' };
exports.getAddStory = (req, res) => {
  res.render('add-story', {
    title: "Adauga o poveste"
  }) ;
  
};

exports.postAddStory = (req, res) => {
  const story = new Story({
    author: req.user._id,
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    fundingTarget: req.body.fundingTarget,
  });
  story.save((err) => {
      if (err) { 
        req.flash('errors', { msg: 'Account with that email address already exists.' });
      }
      return res.redirect('/');
  });
};
exports.getEditStory = (req, res) => {return ''  };
exports.postEditStory = (req, res) => { return '' };
exports.getDeleteStory = (req, res) => {return ''  };
const Story = require('../models/Story');
const User = require("../models/User");
const fs = require("fs");
const mobilpay = require('../payment/order.js');


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
      vettedStories.forEach((item) => {
        item.progress = Math.floor(parseInt(item.funded) / parseInt(item.fundingTarget) * 100);
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

exports.getAbout = (req, res) => {
  res.render('about');
}

exports.getSingle = (req, res) => {
  Story.findOne({_id:req.params.id}).exec((err, doc) => {
    if (!err) {
      User.findOne({_id:doc.author}).exec((err, user) => {
        if (!err) {
          doc.author=user;
          doc.content = fs.readFileSync(__dirname+ '/../public/content/templates/' + doc._id + '.html');
          if (typeof doc.status != 'undefined' && doc.status != 'new')  {
            doc.progress = Math.floor(parseInt(doc.funded) / parseInt(doc.fundingTarget) * 100);
          }
          
          res.render('single',
            {
              title: doc.title,
              story: doc,
              canonicalUrl: 'http://' + req.headers.host + req.route.path
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
      docs.forEach( (item, index) => {
        if (!err) {
          if (typeof item.status != 'undefined' && item.status != 'new')  {
            item.progress = Math.floor(parseInt(item.funded) / parseInt(item.fundingTarget) * 100);
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
      var isInArray = story.likes.some(function (like) {
          return like.equals(req.user._id);
      });
      if (!isInArray) {
        Story.update({_id:story._id}, {$push: {'likes': req.user._id}}, {}, (err, story) => {
          console.log(err, story);
        });
      }
      return res.redirect('/story/'+story._id);
    }
  });
}

exports.getDonate = (req, res) => {
  console.log(req.query.amount);
  var payReq = mobilpay.getRequest(req.params.id, req.query.amount);
  payReq.url = 'http://sandboxsecure.mobilpay.ro/'
  res.render('mobilpay', payReq);
};

exports.postDonate = (req, res) => {
  var data = mobilpay.decodeResponse(req.body).then((result) => {
    Story.findOne({_id:req.params.id}, (err, story) => {
      if (!err) {
        story.funded = parseInt(story.funded) + parseInt(result.order.invoice.$.amount);
        story.backers = parseInt(story.backers) + 1;
        story.save();
      }
    });
  });
  res.send('OK');
};

exports.postFundStory = (req, res) => {
  Story.findOne({_id:req.params.id}, (err, story) => {
    if (!err) {
      story.funded = parseInt(story.funded) + parseInt(req.body.amount);
      story.backers++;
      story.save();
    }
  });
}
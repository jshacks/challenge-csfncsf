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
  res.render('single',
  {
    title: 'Story',
    
    // story: Story.findOne({}),
    
    messages: {
      
    }
  }
  );
}
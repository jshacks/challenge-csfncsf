/**
 * GET /
 * Home page.
 */
exports.getApi = (req, res) => {
  res.render('api', {
    title: 'api'
  });
};
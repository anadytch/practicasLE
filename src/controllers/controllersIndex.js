const controllersIndex = {};

controllersIndex.renderIndex = (req, res) => {
    res.render('index');
};

controllersIndex.renderAbout = (req, res) => {
    res.render('about');
};

module.exports = controllersIndex;

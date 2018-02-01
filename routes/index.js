// home page with info
module.exports = (app) => {
	app.get('/', (req, res) => {
		res.render('index');
	});
};
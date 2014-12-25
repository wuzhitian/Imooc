var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');

module.exports = function(app){
	//pre handle user
	app.use(function(req, res, next){
		var _user = req.session.user;
		app.locals.user = _user;
		next();
	});
	//Admin
	app.use('/admin', User.signinRequired, User.adminRequired);
	//Index
	app.get('/', Index.index);

	//User 
	app.post('/user/signup', User.signup);
	app.post('/user/signin', User.signin);
	app.get('/logout', User.logout);
	app.get('/admin/user/list', User.list);
	app.get('/signin', User.showSignin);
	app.get('/signup', User.showSignup);

	//Movie
	app.get('/movie/:id', Movie.detail);

	//admin
		//movie
	app.get('/admin/movie/new', Movie.new);
	app.post('/admin/movie', Movie.save);
	app.get('/admin/movie/update/:id', Movie.update);
	app.get('/admin/movielist', Movie.list);
	app.delete('/admin/movie/list', Movie.del);
		//category
	app.get('/admin/category/new', Category.new);
	app.post("/admin/modifyCategory", Category.save);
	app.get('/admin/categorylist', Category.list);

	//Comment
	app.post('/user/comment', User.signinRequired, Comment.save);
}
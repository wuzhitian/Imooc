var User = require("../models/user");
//signup 
exports.signup = function(req, res){
	// router > body > query
	// var _userId = req.query.userId;
	// var _user = req.param('user');
	var _user = req.body.user;
	User.find({name: _user.name}, function(err, user){
		console.log(user);
		if(err){
			console.log(err)
		}
		if(user.name){
			return res.redirect('/signin')
		}
		var user = new User(_user);
		user.save(function(err, user){
			if(err){
				console.log(err);
			}
			res.redirect('/');
		});
	})
}

//signin
exports.signin = function(req, res){
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;
	User.findOne({name: name}, function(err, user){
		if(err){
			console.log(err)
		}
		if(!user){
			console.log("nobody");
			return res.redirect('/signup')
		}

		user.comparePassword(password, function(err, isMatch){
			if(err){
				console.log(err)
			}
			if(isMatch){
				req.session.user = user;
				return res.redirect("/")
			}else{
				console.log("unMatch");
				return res.redirect('/signin');
			}
		});
	})
}

//logout
exports.logout = function(req, res){
	delete req.session.user;
	// delete app.locals.user;
	res.redirect("/");
}

//list page
exports.list = function(req, res){
	User.fetch(function(err, users){
		if(err){
			console.log(err)
		}
		res.render("userlist", {
			title: "USERLIST"
			,users: users
		})
	})
}

//show signin
exports.showSignin = function(req, res){
	res.render("signin", {
		title: "SIGNIN"
	})
}
//show signup
exports.showSignup = function(req, res){
	res.render('signup', {
		title: "REGISTER"
	})
}

//midware for admin
exports.signinRequired = function(req, res, next){
	var user = req.session.user;
	if(!user){
		return res.redirect('/signin');
	}
	next();
}
exports.adminRequired = function(req, res, next){
	var user = req.session.user;
	if(user.role >= 10){
		next();
	}else{
		res.redirect('/');
	}
}
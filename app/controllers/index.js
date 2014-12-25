var Movie = require("../models/movie");
var Category = require("../models/category")

//index page
exports.index = function(req, res){
	// console.log("user: ssss");
	// console.log(req.session.user);
	Catetgry.find({})
			.populate({
				path: "movies"
				,options: {
					limit: 5
				}
			}).exec(function(err, catetories){
				if(err){
					console.log(err);
				}
				res.render('index', {
					title: "Imooc Index"
					,catetories: catetories
				})
			})
	
	// Movie.fetch(function(err, movies){
	// 	if(err){
	// 		console.log(err)
	// 	}
	// 	res.render('index', {
	// 		title: "HELLo"
	// 		,movies: movies
	// 	});
	// })
}
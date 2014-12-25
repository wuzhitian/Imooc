var Movie = require("../models/movie");
var Comment = require("../models/comment");
var _ = require('underscore');

//detail page
exports.detail = function(req, res){
	var id = req.params.id;

	Movie.findById(id, function(err, movie){
		if(err){
			console.log(err)
		}
		Comment.find({movie: id})
		.populate("from", "name")
		.populate("reply.from reply.to", 'name')
		.exec(function(err, comments){
			console.log(comments);
			res.render('detail', {
				title: 'imooc' + movie.title
				,movie: movie
				,comments: comments
			})
		})
		
		// Comment.find({movie: id}, function(err, comments){
		// 	console.log(comments);
		// 	res.render('detail', { 
		// 		title: 'imooc' + movie.title
		// 		,movie: movie
		// 		,comments: comments
		// 	})
		// })
	})
}
//admin new page
exports.new = function(req, res){
	res.render("admin", {
		title: "imooc admin",
		movie: {
			category: "",
			director: "",
			country: "",
			title: "",
			year: "",
			poster: "",
			language: "",
			flash: "",
			summary: ""
		}
	})
}

//admin post movie
exports.save = function(req, res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
	if(id !== "undefined"){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err)
			}
			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie){
				if(err){
					console.log(err)
				}

				res.redirect('/movie/'+ movie._id)
			})
		})
	}else{
		console.log(123456);
		_movie = new Movie({
			director: movieObj.director,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		})

		_movie.save(function(err, movie){
			if(err){
				console.log(err)
			}
			console.log(movie._id);
			res.redirect('/movie/'+ movie._id)
		})
	}
}

//admin update movie
exports.update = function(req, res){
	var id = req.params.id;
	if(id){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err);
			}
			res.render('admin', {
				title: "Background Update Page"
				,movie: movie
			})
		})
	}
}

//list page
exports.list = function(req, res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err);
		}
		res.render('list',{
			title: "imooc list"
			,movies: movies
		})
	});
}

//list delete movie
exports.del = function(req, res){
	var id = req.body.id;
	if(id){
		Movie.remove({_id:id}, function(err, movie){
			if(err){
				console.log(err)
			}else{
				res.json({
					success: 1
				})
			}
		})
	}
}
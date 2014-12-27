var Movie = require("../models/movie");
var Category = require("../models/category");
var Comment = require("../models/comment");
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

//detail page
exports.detail = function(req, res){
    var id = req.params.id;
    Movie.update({_id: id}, {$inc: {pv: 1}}, function(err){
        if(err){
            console.log(err)
        }
    });
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
        //  console.log(comments);
        //  res.render('detail', { 
        //      title: 'imooc' + movie.title
        //      ,movie: movie
        //      ,comments: comments
        //  })
        // })
    })
}
//admin new page
exports.new = function(req, res){
    Category.find({}, function(err, categories){
        res.render("admin", {
            title: "imooc admin",
            categories: categories
            ,movie: {
                // category: "",
                // director: "",
                // country: "",
                // title: "",
                // year: "",
                // poster: "",
                // language: "",
                // flash: "",
                // summary: ""
            }
        })
    })
}

//admin save poster
exports.savePoster = function(req, res, next){
    var posterData = req.files.uploadPoster;
    var filePath = posterData.path;
    console.log(filePath);
    var originalname = posterData.originalname;

    if(originalname){
        fs.readFile(filePath, function(err, data){
            console.log(data);
            var timestamp = Date.now();
            var poster = timestamp + "." + posterData.extension;
            var newPath = path.join(__dirname, '../../', '/public/upload/' + poster);
            fs.writeFile(newPath, data, function(err){
               req.poster = poster
               next();
            })
            next();
        })
    }else{
        next();
    }
}


//admin post movie
exports.save = function(req, res){
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    if(req.poster){
        movieObj.poster = req.poster;
    }

    if(id){
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
        _movie = new Movie({
            director: movieObj.director,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash,
            category: movieObj.category
        })

        var categoryId = movieObj.category;

        var categoryId = _movie.category;
        _movie.save(function(err, movie){
            console.log(movie);
            if(err){
                console.log(err)
            }
            if(categoryId){
                Category.findById(categoryId, function(err, category){
                        category.movies.push(movie._id);
    
                    category.save(function(err, category){
                        console.log(movie._id);
                        res.redirect('/movie/'+ movie._id)
                    });
                });
            }else{
                var categoryName = movieObj.categoryName || parseInt(Math.random()*Math.random()*10000);
                var _catetory = new Category({
                    name: categoryName
                    ,movies: [movie._id]
                });
                _catetory.save(function(err, category){
                    if(err){
                        console.log(err);
                    }
                    movie.category = category._id;
                    movie.save(function(err, movie0){
                        res.redirect('/movie/'+ movie0._id);
                    })
                });
            }

        })
    }
}

//admin update movie
exports.update = function(req, res){
    var id = req.params.id;
    if(id){

        Movie.findById(id, function(err, movie){
            Category.find({}, function(err, categories){
                if(err){
                    console.log(err);
                }
                res.render('admin', {
                    title: "Background Update Page"
                    ,movie: movie
                    ,categories: categories
                })
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
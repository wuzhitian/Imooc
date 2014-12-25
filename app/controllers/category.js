var Category = require("../models/category");
var _ = require("underscore");


//admin/catetroy
exports.new = function(req, res){
	res.render("category_admin", {
		title: "Record Category"
		,category: {
			// name: ""
		}
	})
};

// admin/modifyCatetroy
exports.save = function(req, res){
	var _category = req.body.category;
	var category = new Category(_category);

	category.save(function(err, category){
		if(err){
			console.log(err)
		}

		res.redirect('/admin/categorylist');
	})
};

// admin/catetroylist
exports.list = function(req, res){
	console.log("EERR");
	Category.fetch(function(err, categories){
		if(err){
			console.log(err)
		}
		console.log(categories);
		res.render('categorylist', {
			title: "Category List"
			,categories: categories
		});
	})
}
 
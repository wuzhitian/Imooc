var express = require('express');
var path = require('path');

//middleware import
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoStore = require('connect-mongo')(session);


var fs = require('fs');
//models loading
var models_path = __dirname + 'app/models/';
var walk = function(path){
	fs.readdirSync(path).forEach(function(file){
		var newPath = path + '/' + file;
		var stat = fs.statSync(newPath);

		if(stat.isFile()){
			if(/(.*)\.(js|coffee)/.test(file)){
				require(newPath)
			}
		}else if(stat.isDirectory()){
			walk(newpath)
		}
	})
}

//connect to db
var dbUrl = "mongodb://localhost/imooc";
mongoose.connect(dbUrl);


var app = express();
var port = process.env.PORT || 3000;
app.listen(port); 

app.set("views", './app/views/pages');
app.set("view engine", 'jade');
app.locals.moment = require('moment');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(multer());
app.use(session({
	secret: 'imooc'
	,resave: false
	,saveUninitialized: true
	,store: new mongoStore({
		url: dbUrl
		,collection: "sessions"
	})
}));

if('development' === app.get('env')){
	app.set("showStackError", true);
	app.use(morgan(':method :url :status'));
	app.locals.pretty = true;
	mongoose.set('debug', true);
}

require('./config/routes')(app);

console.log('imooc started on port ' + port);
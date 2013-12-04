/*
|-----------------------------------------------------------------------
| Modules
|-----------------------------------------------------------------------
 */
var express = require('express');
var routes = require('./routes');
var articles = require('./routes/articles');
var http = require('http');
var path = require('path');

var app = express();

/*
|-----------------------------------------------------------------------
| Configurations
|-----------------------------------------------------------------------
 */
// all environments
app.set('port', process.env.PORT || 3000); // port config
app.set('views', path.join(__dirname, 'views')); // views path
app.set('view engine', 'jade'); // view compiling engine
app.use(express.favicon()); // express default favicon
app.use(express.logger('dev')); // log leval
app.use(express.json()); // w/e
app.use(express.urlencoded()); // w/e
app.use(express.methodOverride()); // probably apache stuff
app.use(app.router); //routes path
app.use(require('stylus').middleware(path.join(__dirname, 'public'))); // stylus
app.use(express.static(path.join(__dirname, 'public'))); // stylus framework middleware compiling

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*
|-----------------------------------------------------------------------
| Routes
|-----------------------------------------------------------------------
 */
app.get('/', routes.index);
app.get('/articles', articles.list);
app.get('/articles/new', articles.new);
app.get('/articles/:slug', articles.edit);
app.get('/articles/:slug/delete', articles.remove);
app.post('/articles', articles.save);

/*
|-----------------------------------------------------------------------
| Start Server
|-----------------------------------------------------------------------
 */
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

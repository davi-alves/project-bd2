var MongoClient = require('mongodb').MongoClient,
  Server = require('mongodb').Server,
  ObjectID = require('mongodb').ObjectID,
  urlSlug = require('../helpers/url').url_slug,
  ArticleProvider,
  provider;

// init client
var Client = new MongoClient(new Server('localhost', 27017));
/**
 * Open the connection with mongo server
 * @param  {Object} err    error object
 * @param  {Object} client mongo client object
 * @return {void}
 */
Client.open(function (err, client) {
  provider = client.db('db2-project');
});

/**
 * Return the collection object
 * @param  {Function} callback callback function
 * @return {void}
 */
function articlesCollection(callback) {
  provider.collection('articles', function (err, collection) {
    callback(err, collection);
  });
}

/**
 * Returned object provider
 */
ArticleProvider = function () {};

/**
 * Find all articles
 * @param  {Function} callback callback function
 * @return {void}
 */
ArticleProvider.prototype.findAll = function (callback) {
  articlesCollection(function (err, collection) {
    if (err) {
      callback(err);
    } else {
      collection.find({}, {
        sort: [['updated_at', 'desc']]
      }).toArray(function (err, data) {
        callback(err, data);
      });
    }
  });
};

/**
 * Find article by slug
 * @param  {string}   slug     the article slug
 * @param  {Function} callback the callback function
 * @return {void}
 */
ArticleProvider.prototype.findBySlug = function (slug, callback) {
  articlesCollection(function (err, collection) {
    if (err) {
      callback(err);
    } else {
      collection.findOne({
        slug: slug
      }, function (err, data) {
        callback(err, data);
      });
    }
  });
};

/**
 * Save the article to the database
 * @param  {Object}   article  article data
 * @param  {Function} callback the callback function
 * @return {void}
 */
ArticleProvider.prototype.save = function (article, callback) {
  if (article._id) {};
  articlesCollection(function (err, collection) {
    if (err) {
      callback(err);
    } else {
      var _id = article._id;
      // CREATE SLUG FROM TITLE
      article.slug = urlSlug(article.title);

      if (_id) {
        // UPDATE DOCUMENT
        delete article._id;
        // SET TIME OF ACTION
        article.updated_at = new Date();

        collection.update({
            _id: ObjectID(_id)
          }, {
            $set: article
          },
          function (err, updated) {
            callback(err, updated);
          }
        );
      } else {
        // SET TIME OF ACTION
        article.created_at = new Date();
        article.updated_at = new Date();

        // INSERT A NEW DOCUMENT
        collection.insert(
          article,
          function (err, data) {
            callback(err, data);
          }
        );
      }
    }
  })
};

ArticleProvider.prototype.remove = function (slug, callback) {
  articlesCollection(function (err, collection) {
    if (err) {
      callback(err);
    } else {
      collection.remove({
        slug: slug
      }, function (err, removed) {
        callback(err, removed);
      });
    }
  });
};

exports.ArticleProvider = new ArticleProvider;

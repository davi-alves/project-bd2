var articles = require('../providers/articles').ArticleProvider;

/*
|-----------------------------------------------------------------------
| List
|-----------------------------------------------------------------------
 */
exports.list = function (req, res) {
  articles.findAll(function (error, articles) {
    res.render('articles/list', {
      title: 'Artigos',
      articles: articles,
      btn: {
        title: 'Adicionar',
        type: 'success',
        href: '/articles/new'
      }
    });
  });
};

/*
|-----------------------------------------------------------------------
| New
|-----------------------------------------------------------------------
 */
exports.new = function (req, res) {
  articles.findAll(function (error, docs) {
    res.render('articles/new', {
      title: 'Novo Artigo',
      btn: {
        title: 'Voltar',
        type: 'default',
        href: '/articles'
      }
    });
  });
};

/*
|-----------------------------------------------------------------------
| Edit
|-----------------------------------------------------------------------
 */
exports.edit = function (req, res) {
  articles.findBySlug(req.params.slug, function (error, article) {
    res.render('articles/edit', {
      title: 'Editar Artigo',
      article: article,
      btn: {
        title: 'Voltar',
        type: 'default',
        href: '/articles'
      }
    });
  });
};

/*
|-----------------------------------------------------------------------
| Remove
|-----------------------------------------------------------------------
 */
exports.remove = function (req, res) {
  articles.remove(req.param('slug'), function (error, docs) {
    res.redirect('/articles');
  });
};

/*
|-----------------------------------------------------------------------
| Save
|-----------------------------------------------------------------------
 */
exports.save = function (req, res) {
  var article = {
    title: req.param('title'),
    slug: req.param('slug'),
    body: req.param('body')
  };

  if (req.param('_id')) {
    article._id = req.param('_id')
  }

  articles.save(article, function (error, docs) {
    res.redirect('/articles');
  });
};

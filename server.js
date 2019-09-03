var express = require('express');
var logger = require('morgan');
var axios = require('axios');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
var db = require('./models');

var PORT = 3033;

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger('dev'));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static floder
app.use(express.static('public'));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';
mongoose.connect(MONGODB_URI);

// Routes
// GET route for scraping the website
app.get('/scrape', function (req, res) {
    axios.get('http://www.foxnews.com/').then(function (response) {
        var $ = cheerio.load(response.data);

        $('article h2').each(function (i, element) {
            // Save empty result object
            var result = {};

            result.headline = $(this)
                .children('a')
                .text();
            result.summary = $(this)
                // .children('a')
                // .find('p.summary')
                .text();
            result.url = $(this)
                .children('a')
                .attr('href');

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });

        res.send('Scrape Complete.');
    });
});

// GET route for getting all Articles from the db
app.get('/articles', function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// GET route for getting specific Article by id and populate with associated comments
app.get('/articles/:id', function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate('comment')
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// POST route for saving/updating an Article's associated Comment
app.post('/articles/:id', function (req, res) {
    db.Comment.create(req.body)
        .then(function (dbComment) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get('/delete', function(req, res) {
    db.Article.remove({}, function(err) {
        if (!err) {
                message.type = 'notification!';
                res.json(dbArticle);
        }
        else {
                message.type = 'error';
        }
    });
});

// Start server
app.listen(PORT, function () {
    console.log('App running on port ' + PORT);
});
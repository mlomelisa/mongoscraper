var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongosedb", { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
	axios.get("http://www.nytimes.com/").then(function(response) {
		var $ = cheerio.load(response.data);
		
    // $("article > div > div > div > a").each(function(i, element) {
      $(".assetWrapper").each(function(i, element) {
        var results = [];
      // Save the text of the element in a "title" variable
      var title = $(this).find('h2').text();
      var link = $(this).find('a').attr('href');
      var img = $(this).find('img').attr('src');
      var summary = $(this).find('p').text();
  
      // Save these results in an object that we'll push into the results array we defined earlier
      results.push({
        title : title,
        link : link,
        img : img,
        summary : summary,
        saved: false
      })
            // Create a new Article using the `result` object built from scraping
            db.Article.create(results)
            .then(function(dbArticle) {
              // View the added result in the console
              console.log(dbArticle);
            })
            .catch(function(error) {
              // If an error occurred, log it
              res.json(error);
            });
      
      })
 

  //   //   // Log the results once you've looped through each of the elements found with cheerio
      console.log(results);
    }).catch(function(err){
      if (err) throw err
    });
 })
    app.get("/articles", function(req, res) {
      db.Article.find({})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      })
    });

    app.put("/api/clear", function(req, res) {
      db.Article.remove({saved:false})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
    });
  
    app.get("/articles/:_id", function(req, res) {
      db.Article.findOneAndUpdate('"' + req.param.id + '"',{saved: true})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
    });





// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

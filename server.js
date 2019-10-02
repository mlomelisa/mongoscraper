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
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongosedb"
mongoose.connect(MONGODB_URI);

// Routes


//AJAX request for any unsaved headlines
app.get("/api/headlines", function(req, res) {
  let saved = req.query.saved;
  console.log(saved)
  db.Article.find({saved:saved})
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  })
});

// Article to save

app.put("/api/headlines/:id", function(req, res) {
  db.Article.findOneAndUpdate({_id:req.params.id}, {saved:true})
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  })
});

// Scrape New Articles

app.get("/api/fetch", function(req, res) {
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
      console.log(results)
          // Create a new Article using the `result` object built from scraping
          // db.Article.update({
          //   query: {results},
          //   upsert: true
          // })
          //   .then(function(dbArticle) {
              
          //     res.json(dbArticle);
          //   })
          //   .catch(function(error) {
          //     // If an error occurred, log it
              
          //     res.json(error);
          //   });

             db.Article.create(results)
            .then(function(dbArticle) {
              
              res.json(dbArticle);
            })
            .catch(function(error) {
              // If an error occurred, log it
              
              res.json(error);
            });

          
      }) 
     // Send a message to the client
  res.send("Scrape Complete");
  });
 
});


 //Clear Articles

 app.get("/api/clear", function(req, res) {
  db.Article.deleteMany({save:false})
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  })
});

// Delete Article

app.delete("/api/headlines/:id", function(req, res) {
  db.Article.findOneAndDelete({_id:req.param.id})
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  })
});

//Pull notes for a specific article
app.get("/api/notes/:id", function(req, res) {
  db.Article.findOne({_id:req.param.id})
  .populate("note")
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  })
});

//Save note to specific article
app.post("/api/notes", function(req, res) {
  db.Note.create(req.body) 
 .then(function(dbNote) {
    return db.Article.findOneAndUpdate({_id:req.body.id}, {note: dbNote._id}, {new: true});
  })
  .catch(function(err) {
    res.json(err);
  })
});

// Delete Note
app.delete("/api/notes/:id", function(req, res) {
  db.Note.tfindOneAndDelee({_id:req.param.id}) 
 .then(function(dbNote) {
    return db.Article.findOneAndDelete({_id:req.body.id}, {note: dbNote._id});
  })
  .catch(function(err) {
    res.json(err);
  })
});


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

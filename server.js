var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server



var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();
// Make public a static folder
app.use(express.static("public"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));



var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongosedb" 
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes
var routes = require("./controllers/article");
app.use(routes)



// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

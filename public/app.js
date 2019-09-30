$(document).ready(function() {

  function createCard(article) {
    // This function takes in a single JSON object for an article/headline
    // It constructs a jQuery element containing all of the formatted HTML for the
    // article card
    var card = $("<div class='card'>");
    var cardHeader = $("<div class='card-header'>").append(
      $("<h3>").append(
        $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
          .attr("href", "https://www.nytimes.com" + article.link)
          .text(article.title),
        $("<a data-id='" + article._id + "' class='btn btn-success addnote'>Add Note</a>"),
        $("<a data-id='" + article._id + "' class='btn btn-success save'>Save Article</a>")
      )
    );

    var cardBody = $("<div class='card-body'>").text(article.summary);

    card.append(cardHeader, cardBody);
    // We attach the article's id to the jQuery element
    // We will use this when trying to figure out which article the user wants to save
    card.data("_id", article._id);
    // We return the constructed card jQuery element
    return card;
  }

  function renderArticles(articles) {
    // This function handles appending HTML containing our article data to the page
    // We are passed an array of JSON containing all available articles in our database
    var articleCards = [];
    // We pass each article JSON object to the createCard function which returns a bootstrap
    // card with our article data inside
    for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));
    }
    // Once we have all of the HTML for the articles stored in our articleCards array,
    // append them to the articleCards container
    $('.article-container').append(articleCards);
  }

  // Grab the articles as a json
  $('.scrape-new').on('click', function() {
    event.preventDefault();
   $.get('/scrape', function(){
  
   });

    $.getJSON("/articles", function(articles){
      // For each one
      renderArticles(articles)
    })
  });

  function renderEmpty() {
    // This function renders some HTML to the page explaining we don't have any articles to view
    // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
        "</div>",
        "<div class='card'>",
        "<div class='card-header text-center'>",
        "<h3>What Would You Like To Do?</h3>",
        "</div>",
        "<div class='card-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    // Appending this data to the page
    $('.article-container').append(emptyAlert);
  }


  $('.clear').on('click', function() {
    event.preventDefault();
    $.put("/api/clear").then(function() {
    $('.article-container').empty();
  
  });

});

$(document).on("click", ".btn.save", function(){
  event.preventDefault();

  var articleToSave = $(this)
      .parents(".card")
      .data();

    // Remove card from page
    $(this)
      .parents(".card")
      .remove();

    articleToSave.saved = true;

    var thisId = $(this).attr("data-id");


   console.log(thisId)
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
    data: articleToSave
  }).then(function(data) {
    if (data.saved) {
        $.get("/articles?saved=false").then(function(data) {
          $('.article-container').empty();
       // If we have headlines, render them to the page
       if (data && data.length) {
         renderArticles(data);
       } else {
         // Otherwise render a message explaining we have no articles
         renderEmpty();
       }
     });
    }
  })
});
});
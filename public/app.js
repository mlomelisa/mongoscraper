$(document).ready(function() {
// Grab the articles as a json
  $('.scrape-new').on('click', function() {
   $.get('/scrape', function(){
    
   });

    $.getJSON("/articles", function(articles){
      // For each one
      var articleCards = [];
      // We pass each article JSON object to the createCard function which returns a bootstrap
      // card with our article data inside
      for (var i = 0; i < articles.length; i++) {
        articleCards.push(createCard(articles[i]));
      }
      $('.article-container').append(articleCards);
    })
  });

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
        $("<a class='btn btn-success addnote'>Add Note</a>"),
        $("<a class='btn btn-success save'>Save Article</a>")
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

})

function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    var streetInput = $('#street').val();
    var cityInput = $('#city').val();
    var address = streetInput + ',' + cityInput;
    var addressUrl =  'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address; 

    $greeting.text('So you would like to live at ' + address + '?')
    $body.append('<img class="bgimg">');
    $('.bgimg').attr('src', addressUrl);

    //GET NYT articles about the address
    var nytApiUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + address + '&sort=newest&api-key=2f5b9811f1a76527afcde90c92017360:19:72034661';

    $.getJSON(nytApiUrl, function(data) {
        $nytHeaderElem.text('New York Times articles about ' + cityInput);

        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' + '<a href="' + article.web_url + '">' + article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
        };

    }).error(function() {
            $nytHeaderElem.text('New York Times Articles Could Not be Loaded.');
    });

    //GET articles about the city
    var wikiApiUrl = 'http://en.wikiasdpedia.org/w/api.php?action=opensearch&search=' + cityInput + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiApiUrl,
        dataType: 'jsonp',
        success: function(response){
            var articleList = response[1];
            for (var j=0; j < articleList.length; j++) {
                var articleStr = articleList[j];
                var wikiUrl = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li>' + '<a href="' + wikiUrl + '">' + articleStr + '</a>' + '</li>' );
            };
            clearTimeout (wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);


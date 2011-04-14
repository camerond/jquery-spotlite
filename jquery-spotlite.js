$(function() {

  $.fn.spotlite = function(terms, $match_list, $result_list, options) {
    return this.each(function() {
      var defaults = {
        result_limit: 10,
        pool: generatePool(terms),
        match_list: $match_list,
        result_list: $result_list
      };
      var opts = $.extend(defaults, options);
      var $spot = $(this);
      var $input = $spot.find("input[type='text']");

      $input.bind("keyup", function() {
        populateMatches.call(opts, $input.val());
        highlightMatch.call(opts, 0);
      });

    });

  };

  function generatePool(terms) {
    var pool = [],
        match_item = {};
    for(var i = 0; i < terms.length; i++) {
      var words = $.trim(terms[i]).split(" ");
      for(var j = 0; j < words.length; j++) {
        match_item.term = terms[i];
        match_item.search_term = words.slice(j).join(" ");
        pool.push($.extend({}, match_item));
      }
    }
    return pool;
  }

  function populateMatches(ss) {
    var results = [],
        opts = this,
        $ul = opts.match_list,
        pool = opts.pool;
    if(!ss.length) return false;
    $ul.find("li").detach();
    for(var i = 0; i < pool.length && results.length < this.result_limit; i++) {
      if(ss.toLowerCase() == pool[i].search_term.substring(0, ss.length).toLowerCase()) {
        results.push($("<li />").text(pool[i].term)[0]);
      }
    }
    if (results.length) {
      $ul.append($(results)).find("li").live("mouseover", function() {
        highlightMatch.call(opts, $(this).index());
      });
    }
    return this;
  }

  function highlightMatch(num) {
    this.match_list.find("li").removeClass("spotlite-selected");
    this.match_list.find("li:eq(" + num + ")").addClass("spotlite-selected");
  }

});

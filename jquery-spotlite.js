$(function() {

  $.fn.spotlite = function(terms, $match_list, $result_list, options) {
    return this.each(function() {
      var defaults = {
        result_limit: 10,
        pool: generatePool(terms),
        cache: [],
        match_list: $match_list.hide(),
        result_list: $result_list,
        current_val: ''
      };
      var opts = $.extend(defaults, options);
      var $spot = $(this);
      var $input = $spot.find("input[type='text']");
      current_val = $input.val();

      $input.bind("keydown.spotlite", function(e) {
        var ss = $input.val();
        if (opts.current_val != ss) {
          opts.cache = populateMatches.call(opts, ss);
          highlightMatch.call(opts, 0);
          opts.current_val = ss;
        } else {
          handleKeypress.call(opts, e.keyCode);
        }
      });

      $input.bind("focus.spotlite", function(e) {
        if(opts.match_list.find("li").length > 0) {
          opts.match_list.show();
        }
      });

      $("body").live("click.spotlite", function(e) {
        if(!$.contains($spot[0], e.target)) {
          opts.match_list.hide();
        }
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
        match_item.search_term = words.slice(j).join(" ").toLowerCase();
        pool.push($.extend({}, match_item));
      }
    }
    return pool;
  }

  function populateMatches(ss) {
    if (!ss.length) return false;
    var results = [],
        opts = this,
        $ul = opts.match_list,
        pool = opts.pool,
        new_cache = [];
    $ul.find("li").detach();
    if (ss.length > 1 && opts.current_val === ss.substring(0, ss.length-1)) {
      pool = opts.cache;
    }
    for (var i = 0; i < pool.length; i++) {
      if(ss.toLowerCase() === pool[i].search_term.substring(0, ss.length)) {
        if(results.length < this.result_limit) {
          results.push($("<li />").text(pool[i].term)[0]);
        }
        new_cache.push(pool[i]);
      }
    }
    if (results.length) {
      $ul.show().append($(results)).find("li").live("mouseover.spotlite", function() {
        highlightMatch.call(opts, $(this).index());
      });
    }
    return new_cache;
  }

  function highlightMatch(num) {
    this.match_list.find("li").removeClass("spotlite-selected");
    this.match_list.find("li:eq(" + num + ")").addClass("spotlite-selected");
  }

  function handleKeypress(keycode) {
    var keys = [],
        $ul = this.match_list,
        $li = $ul.find("li.spotlite-selected");
    if (keycode === 40 && ($li.index() != $li.siblings().length)) {
      highlightMatch.call(this, $li.index() + 1);
    } else if (keycode === 38 && ($li.index() != 0)) {
      highlightMatch.call(this, $li.index() - 1);
    } else if (keycode === 27 && ($ul.find("li").length > 0)) {
      $ul.hide();
    }

  }

});

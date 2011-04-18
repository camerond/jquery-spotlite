$(function() {

  $.fn.spotlite = function(terms, $match_list, $result_list, options) {
    return this.each(function() {
      var defaults = {
        result_limit: 10,
        pool: generatePool(terms),
        cache: [],
        match_list: $match_list.hide(),
        result_list: $result_list,
        current_val: '',
        match_count: 0
      };
      var opts = $.extend(defaults, options);
      var $spot = $(this);
      var $input = $spot.find("input[type='text']");

      $input.bind("keydown.spotlite", function(e) {
        var ss = $input.val();
        if (ss && opts.current_val != ss) {
          opts.cache = populateMatches.call(opts, ss);
          highlightMatch.call(opts, 0);
          opts.current_val = ss;
        } else {
          handleKeypress.call(opts, e.keyCode);
        }
      });

      $input.bind("click.spotlite focus.spotlite", function(e) {
        if (opts.match_count > 0) {
          opts.match_list.show();
        }
      });

      $("body").live("click.spotlite", function(e) {
        if (!$.contains($spot[0], e.target)) {
          opts.match_list.hide();
        }
      });
    });
  };

  function generatePool(terms) {
    var pool = [],
        match_item = {},
        words, i, j, tl, wl;
    for (i = 0, tl = terms.length; i < tl; i++) {
      words = $.trim(terms[i]).split(" ");
      for (j = 0, wl = words.length; j < wl; j++) {
        match_item.term = terms[i];
        match_item.search_term = words.slice(j).join(" ").toLowerCase();
        pool.push($.extend({}, match_item));
      }
    }
    return pool;
  }

  function populateMatches(ss) {
    var results = [],
        opts = this,
        new_cache = [],
        pool = ss.length > 1 && opts.current_val === ss.substring(0, ss.length-1) ? opts.cache : opts.pool;
    opts.match_list.find("li").detach();
    for (var i = 0, pl = pool.length; i < pl; i++) {
      if (ss.toLowerCase() === pool[i].search_term.substring(0, ss.length)) {
        if (results.length < opts.result_limit) {
          results.push($("<li />").text(pool[i].term)[0]);
        }
        new_cache.push(pool[i]);
      }
    }
    if (results.length) {
      opts.match_list.show().append($(results)).find("li").live("mouseover.spotlite", function() {
        highlightMatch.call(opts, $(this).index());
      });
    } else {
      opts.match_list.hide();
    }
    opts.match_count = results.length;
    return new_cache;
  }

  function highlightMatch(num) {
    var $li = this.match_list.find("li");
    if ($li.length) {
      $li.removeClass("spotlite-selected")[num].className += "spotlite-selected";
    }
  }

  function handleKeypress(keycode) {
    var $ul = this.match_list,
        $sel = $ul.find("li.spotlite-selected"),
        idx = $sel.index();
    if (keycode === 40 && (idx != $sel.siblings().length)) {
      highlightMatch.call(this, idx + 1);
    } else if (keycode === 38 && (idx != 0)) {
      highlightMatch.call(this, idx - 1);
    } else if (keycode === 27) {
      $ul.hide();
    }

  }

});

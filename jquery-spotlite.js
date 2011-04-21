$(function() {

  $.fn.spotlite = function(options, secondary) {
    return this.each(function() {

      var $spot = $(this),
          spot = {};

      if (typeof options === 'string') {
        switch (options) {
          case 'refresh':
            init($spot, secondary);
            break;
        }
      } else {
        spot = init($spot, options);
        attachEvents($spot, spot);
      }

    });
  };

  function init($spot, options) {

    var defaults = {
      pool: [],
      match_list: $spot.find("ul:eq(0)").hide(),
      result_list: $spot.find("ul").last(),
      input_field: $spot.find("input[type='text']"),
      result_limit: 10,
      threshold: 1,
      exclude_characters: '\\W',
      output: function(e) { return $("<li />").html(e); }
    };

    var temp_settings = {
      cache: [],
      current_val: '',
      match_count: 0
    };

    var spot = {};

    if ($spot.data('opts.spotlite')) {
      spot = $.extend($spot.data('opts.spotlite'), options, temp_settings);
    } else {
      spot = $.extend(defaults, options, temp_settings);
    }

    generatePool.call(spot);
    $spot.data('opts.spotlite', spot);

    return spot;

  }

  function attachEvents($spot, spot) {
    spot.input_field.bind("keyup.spotlite", function(e) {
      var ss = $(this).val();
      if (ss.length >= spot.threshold && spot.current_val != ss) {
        spot.cache = populateMatches.call(spot, ss);
        highlightMatch.call(spot, 0);
        spot.current_val = ss;
      } else {
        handleKeypress.call(spot, e.keyCode);
      }
    });

    spot.input_field.bind("click.spotlite focus.spotlite", function(e) {
      if (spot.match_count) {
        spot.match_list.show();
      }
    });

    $("body").live("click.spotlite", function(e) {
      if (!$.contains($spot[0], e.target)) {
        spot.match_list.hide();
      }
    });
  }

  function generatePool() {
    var spot = this,
        terms = spot.pool,
        pool = [],
        match_item = {},
        words = [],
        i, j, tl, wl, term;
    for (i = 0, tl = terms.length; i < tl; i++) {
      words = [];
      if (typeof terms[i] === "object") {
        term = terms[i];
        for (t in term) {
          words = $.merge(words, $.trim(term[t]).split(" "));
        }
      } else {
        words = $.trim(terms[i]).split(" ");
      }
      for (j = 0, wl = words.length; j < wl; j++) {
        match_item.term = terms[i];
        match_item.search_term = words.slice(j).join(" ").replace(new RegExp(this.exclude_characters, 'gi'), ' ').toLowerCase();
        pool.push($.extend({}, match_item));
      }
    }
    spot.pool = pool;
  }

  function populateMatches(ss) {
    var results = [],
        spot = this,
        new_cache = [],
        temp_term,
        val,
        item,
        pool = spot.pool;
    if(ss.length > 1 && spot.current_val === ss.substring(0, ss.length-1)) {
      pool = spot.cache;
    } else {
      spot.cache = [];
    }
    spot.match_list.children().remove();
    for (var i = 0, pl = pool.length; i < pl; i++) {
      item = pool[i];
      if (ss.toLowerCase() === $.trim(item.search_term).substring(0, ss.length)) {
        if (results.length < spot.result_limit) {
          if (typeof item.term === "object") {
            temp_term = $.extend({}, item.term);
            for (val in temp_term) {
              temp_term[val] = emphasizeInString(ss, temp_term[val], spot.exclude_characters);
            }
            results.push(spot.output(temp_term)[0]);
          } else {
            results.push(spot.output(emphasizeInString(ss, item.term, spot.exclude_characters))[0]);
          }
        }
        new_cache.push(pool[i]);
      }
    }
    if (results.length && ss.length) {
      spot.match_list.show().append($(results)).children()
        .bind("mouseover.spotlite", function() {
          highlightMatch.call(spot, $(this).index());
      }).bind("click", function() {
        addMatch.call(spot, $(this));
      });
    } else {
      spot.match_list.hide();
    }
    spot.match_count = results.length;
    return new_cache;
  }

  function highlightMatch(num) {
    var $li = this.match_list.children();
    if ($li.length) {
      $li.removeClass("spotlite-selected")[num].className += "spotlite-selected";
    }
  }

  function emphasizeInString(ss, term, excl) {
    term = ' ' + term;
    var sanitized_term = term.replace(new RegExp(excl, 'gi'), ' ');
    var found = term.toLowerCase().indexOf(' ' + ss.toLowerCase());
    if (found < 0) {
      return $.trim(term);
    }
    var to_markup = sanitized_term.substr(found, ss.length + 1);
    return $.trim(term.replace(to_markup, ' <b>' + $.trim(to_markup) + '</b>'));
  }

  function addMatch($el) {
    var spot = this;
    spot.result_list.append(spot.match_list.find(".spotlite-selected").unbind().detach().bind("click.spotlite", function() {
      $(this).remove();
    }));
    spot.match_list.hide().children().detach();
    spot.input_field.val('');
  }

  function handleKeypress(keycode) {
    var spot = this,
        $ul = spot.match_list,
        $sel = $ul.find(".spotlite-selected"),
        idx = $sel.index();
    if (keycode === 40 && (idx != $sel.siblings().length)) {
      highlightMatch.call(this, idx + 1);
    } else if (keycode === 38 && (idx != 0)) {
      highlightMatch.call(this, idx - 1);
    } else if (keycode === 27) {
      $ul.hide();
    } else if (keycode === 13 || keycode === 9) {
      addMatch.call(this, $sel);
    }

  }

});

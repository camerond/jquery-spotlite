/*

jQuery Spotlite Plugin
version 0.1.1

Copyright (c) 2011 Cameron Daigle, http://camerondaigle.com

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

;(function($) {

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
      pool: '',
      match_list: $spot.find("ul:eq(0)").hide(),
      result_list: $spot.find("ul").last(),
      input_field: $spot.find("input[type='text']"),
      result_limit: 10,
      threshold: 1,
      exclude_characters: '\\W',
      bypass: '',
      multiselect: true,
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

    if (spot.bypass.length) {
      spot.bypass = spot.bypass.replace(" ", "").split(",");
    }

    if (typeof spot.pool === 'string') {
      $.getJSON(spot.pool, function(data) {
        generatePool.call(spot, data);
      });
    } else {
      generatePool.call(spot);
    }
    $spot.data('opts.spotlite', spot);

    positionMatches.call(spot);

    return spot;

  }

  function positionMatches() {
    var $input = this.input_field;
    this.match_list.css({
      position: 'absolute',
      'z-index': 1000,
      left: $input.position().left + 'px',
      top: $input.position().top + $input.outerHeight() + 'px',
      width: $input.outerWidth()
    });
  }

  function attachEvents($spot, spot) {
    var keyHandled = false;
    spot.input_field.bind("keydown.spotlite", function(e) {
      keyHandled = handleKeypress.call(spot, e);
    });
    spot.input_field.bind("keyup.spotlite", function(e) {
      if (keyHandled) { return; }
      var ss = $(this).val();
      ss.length ? spot.match_list.show() : spot.match_list.hide();
      if (ss.length >= spot.threshold && spot.current_val != ss) {
        spot.cache = populateMatches.call(spot, ss);
        highlightMatch.call(spot, 0);
        spot.current_val = ss;
      }
    });

    spot.input_field.bind("click.spotlite focus.spotlite", function(e) {
      ($(this).val().length && spot.match_count) ? spot.match_list.show() : spot.match_list.hide();
    });

    $("body").live("click.spotlite", function(e) {
      if (!$.contains($spot[0], e.target)) {
        spot.match_list.hide();
      }
    });
  }

  function generatePool(data) {
    var spot = this,
        terms = data ? data : spot.pool,
        pool = [],
        match_item = {},
        words = [],
        i, j, tl, wl, term;
    for (i = 0, tl = terms.length; i < tl; i++) {
      words = [];
      if (typeof terms[i] === "object") {
        term = terms[i];
        for (t in term) {
          if (spot.bypass.length) {
            if ($.inArray(t, spot.bypass) == -1) {
              words = $.merge(words, $.trim(term[t]).split(" "));
            }
          } else {
            words = $.merge(words, $.trim(term[t]).split(" "));
          }
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
      for (var j = 0, rl = results.length; j < rl; j++) {
        if (!spot.match_list.find(":contains(" + $(results[j]).text() + ")").length) {
          spot.match_list.append(results[j]);
        }
      }
      spot.match_list.show().children()
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
    var to_markup = sanitized_term.substr(found + 1, ss.length);
    return $.trim(term.replace(to_markup, '<b class="spotlite-highlighted">' + to_markup + '</b>'));
  }

  function addMatch($el) {
    var spot = this;
    if (spot.multiselect) {
      if (!spot.result_list.find(":contains(" + $el.text() + ")").length) {
        var hl = $el.find('.spotlite-highlighted');
        hl.replaceWith(hl.html());
        spot.result_list.append($el.removeClass("spotlite-selected").unbind().detach().bind("click.spotlite", function() {
          $(this).animate({ opacity: 0 }, {
            duration: 200,
            complete: function() {
              $(this).slideUp(200, function() {
                $(this).remove();
              });
            }
          });
        }));
        spot.input_field.val('');
        spot.current_val = '';
      }
    } else {
      spot.input_field.val($el.text());
      spot.current_val = $el.text();
    }
    spot.match_list.hide().children().detach();
  }

  function handleKeypress(e) {
    var spot = this,
        keycode = e.keyCode,
        $ul = spot.match_list,
        $sel = $ul.find(".spotlite-selected"),
        idx = $sel.index();
    if (keycode === 40 && (idx != $sel.siblings().length)) {
      highlightMatch.call(this, idx + 1);
    } else if (keycode === 38 && (idx != 0)) {
      highlightMatch.call(this, idx - 1);
    } else if (keycode === 27) {
      $ul.hide();
    } else if (keycode === 13) {
      e.preventDefault();
      addMatch.call(this, $sel);
    } else if (keycode === 9) {
      addMatch.call(this, $sel);
    } else {
      return false;
    }
    return true;
  }

})(jQuery);

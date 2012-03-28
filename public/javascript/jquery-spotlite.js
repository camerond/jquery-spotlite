/*

jQuery Spotlite Plugin
version 0.4.2

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

  var spotlite = {
    pool: [],
    match_limit: 10,
    threshold: 1,
    display_matches_on_focus: false,
    class_prefix: 'spotlite',
    keys: {},
    detect: function() {
      var s = this;
      if (s.$el.is("select")) {
        s.$called_on = s.$el;
        s.$el = $("<input />", {type: "text"}).insertAfter(s.$called_on.hide());
        s.$el.data("spotlite", s.$called_on.data("spotlite"));
        s.$called_on.data(s.class_prefix + "_input", s.$el);
        s.$called_on.find("option").each(function() {
          var $o = $(this);
          s.pool.push({
            search_term: $o.text(),
            $el: $o
          });
        });
      }
    },
    filterMatches: function() {
      var s = this,
          ss = s.$el.val();
      s.$matches.empty();
      for (var i=0, max=s.pool.length; i<max; i++) {
        var st = s.pool[i].search_term;
        if (new RegExp("^" + ss + "| +" + ss, "gi").test(st) && s.$matches.children().length < s.match_limit) {
          s.$matches.append($("<li />").text(st));
        }
      }
      s.$matches.toggle(s.$matches.length);
    },
    keyup: function(e) {
      var s = $(this).data("spotlite");
      if (s.keys[e.keyCode]) {
        s.keys[e.keyCode]();
        return;
      }
      s.filterMatches();
    },
    init: function() {
      var s = this;
      s.detect();
      s.$matches = $("<ul />", {"class": s.class_prefix + "_matches"});
      s.$matches.appendTo("body").hide();
      s.$el.keyup(s.keyup);
    }
  };

  (function(s) {
    $.fn.spotlite = function(opts) {
      return this.each(function() {
        var $e = $(this),
            data = $.extend(true, {
              $el: $e
            }, s, opts);
        data.data = data; // No, really. It's cool.
        $e.data("spotlite", data);
        data.init();
      });
    };
  })(spotlite);
  // 
  // var crap = {
  //   ajax: function(opts) {
  //     var s = spotlite;
  //     if (opts.xhr) { opts.xhr.abort(); }
  //     opts.$match_list.hide();
  //     opts.xhr = $.ajax({
  //       url: opts.ajax_opts.url,
  //       method: opts.ajax_opts.method,
  //       data: "search=" + opts.$input_field.val(),
  //       dataType: "json",
  //       success: function(json, text, xhr) {
  //         delete opts.xhr;
  //         opts.$match_list.empty();
  //         $.each(json.matches, function(i) {
  //           opts.output(json.matches[i]).appendTo(opts.$match_list);
  //         });
  //         generatePool.call(opts, json.matches);
  //         s.filterResults.call(opts.$input_field, { data: { complete: true, opts: opts } });
  //         opts.ajax_opts.success.call(opts.$input_field, json.matches, text, xhr);
  //       },
  //       complete: function(xhr, text) {
  //         delete opts.xhr;
  //         opts.ajax_opts.complete.call(opts.$input_field, xhr, text);
  //       },
  //       error: function(xhr, text, error) {
  //         delete opts.xhr;
  //         opts.ajax_opts.error.call(opts.$input_field, xhr, text, error);
  //       }
  //     });
  //   },
  //   filterResults: function(e) {
  //     var s = spotlite,
  //         opts = e.data.opts;
  //     if (!e.data.complete && e.type === "keyup") {
  //       if (opts.keyHandled) { return; }
  //       if (opts.ajax && opts.ajax_opts.url) {
  //         s.ajax(opts);
  //         return;
  //       }
  //     }
  //     var ss = $(this).val();
  //     if (ss.length >= opts.threshold || opts.display_matches_on_focus) {
  //       opts.cache = populateMatches.call(opts, ss);
  //       selectMatch.call(opts, 0);
  //       if (opts.$select && opts.display_matches_on_focus) {
  //         opts.$match_list.find("li").each(function() {
  //           if($(this).data("spotlite-value") === opts.$select.val()) {
  //             selectMatch.call(opts, $(this).index());
  //             return;
  //           }
  //         });
  //       }
  //       opts.current_val = ss;
  //     } else {
  //       opts.$match_list.hide();
  //     }
  //     opts.keyHandled = false;
  //   },
  //   createResultsList: function(spot) {
  //     return $("<ul />", { "class": spot.class_prefix + "-results" });
  //   }
  // };
  // 
  // $.fn.spotlite = function(options, secondary) {
  //   return this.each(function() {
  // 
  //     var $spot = $(this),
  //         spot = {};
  // 
  //     if (options === 'refresh') {
  //       init($spot, secondary);
  //     } else {
  //       spot = init($spot, options);
  //       attachEvents(spot);
  //     }
  // 
  //   });
  // };
  // 
  // function init($spot, options) {
  // 
  //   var defaults = {
  //   };
  //   defaults.spotlite_original_output = defaults.output;
  // 
  //   var temp_settings = {
  //     cache: [],
  //     current_val: '',
  //     match_count: 0
  //   };
  // 
  //   var spot = {};
  //   if (!options) { options = {}; }
  // 
  //   if ($spot.data('opts.spotlite')) {
  //     spot = $.extend(true, $spot.data('opts.spotlite'), options, temp_settings);
  //   } else {
  //     spot = $.extend(true, defaults, options, temp_settings);
  //   }
  // 
  //   spot.bypass = spot.bypass.length ? spot.bypass.replace(/\s/g, "").split(",") : [];
  // 
  //   if (!options.$input_field && $spot.find("select").length) {
  //     convertSelectTag.call(spot);
  //   } else {
  //     spot.$input_field.addClass(spot.class_prefix + "-input");
  //   }
  // 
  //   if (!options.$match_list) {
  //     spot.$match_list = $("body > ul." + spot.class_prefix + "-matches").hide();
  //     if (!spot.$match_list.length) {
  //       spot.$match_list = $("<ul />").addClass(spot.class_prefix + "-matches").appendTo($("body")).hide();
  //     }
  //   }
  // 
  //   if (!options.$result_list && spot.multiselect && !$spot.find("." + spot.class_prefix + "-results").length) {
  //     spot.$result_list = spotlite.createResultsList(spot).insertAfter(spot.$input_field);
  //   }
  // 
  //   spot.sanitize = function(str) {
  //     return str.replace(new RegExp(spot.exclude_characters, 'gi'), ' ');
  //   };
  // 
  //   spot.showMatches = function() {
  //     var $input = spot.$input_field;
  //     var border_width = parseInt(spot.$match_list.css('border-left-width').replace('px', ''), 10);
  //     border_width += parseInt(spot.$match_list.css('border-right-width').replace('px', ''), 10);
  //     spot.$match_list.css({
  //       position: 'absolute',
  //       'z-index': 1000,
  //       left: $input.offset().left + 'px',
  //       top: $input.offset().top + parseInt($("body").css("border-top-width").replace("px", ""), 10) + $input.outerHeight() + 'px',
  //       width: $input.outerWidth() - border_width
  //     }).show();
  //   };
  // 
  //   if (typeof spot.pool === 'string') {
  //     $.getJSON(spot.pool, function(data) {
  //       generatePool.call(spot, data);
  //     });
  //   } else {
  //     if (!spot.pool.length && spot.$select) {
  //       spot.$select.find("option").each(function() {
  //         spot.pool.push({
  //           text: $(this).text(),
  //           val: $(this).val()
  //         });
  //       });
  //       spot.bypass.push("val");
  //     }
  //     generatePool.call(spot);
  //   }
  //   $spot.data('opts.spotlite', spot);
  // 
  //   return spot;
  // 
  // }
  // 
  // function attachEvents(spot) {
  //   spot.keyHandled = false;
  // 
  //   spot.$input_field.bind("keydown.spotlite", function(e) {
  //     spot.keyHandled = handleKeypress.call(spot, e);
  //   });
  // 
  //   spot.$input_field.bind("keyup.spotlite focus.spotlite", { opts: spot }, spotlite.filterResults);
  // 
  //   spot.$result_list.children().each(function() {
  //     removeOnClick($(this));
  //   });
  // 
  //   $("body").live("click.spotlite", function(e) {
  //     if (!$.contains(spot.$match_list[0], e.target) && !($(e.target).is(":input." + spot.class_prefix + "-input"))) {
  //       spot.$match_list.hide();
  //       if (spot.$select && spot.display_matches_on_focus) {
  //         spot.$input_field.val(spot.$select.find(":selected").text());
  //       }
  //     }
  //   });
  // 
  // }
  // 
  // function convertSelectTag() {
  //   var spot = this;
  //   var $spot = spot.$el;
  //   spot.$select = $spot.find("select").hide();
  //   spot.$input_field = $("<input />", { type: "text" }).addClass(spot.class_prefix + "-input").insertAfter(spot.$select);
  // 
  //   if (spot.$select.attr("multiple")) {
  //     spot.$result_list = spotlite.createResultsList(spot).insertAfter(spot.$input_field);
  //       spot.$select.find(":selected").each(function() {
  //       var $e = $(this),
  //           $li;
  //       if (!$e.val()) { return; }
  //       $li = spot.output($e.text()).data({
  //         select: spot.$select,
  //         "spotlite-value": $e.val()
  //       });
  //       spot.$result_list.append(removeOnClick($li));
  //     });
  //   }
  //   else if (spot.$select.find(":selected").length) {
  //     spot.$input_field.val(spot.$select.find(":selected").text());
  //   }
  // 
  //   var $blank_option = spot.$select.find("option[value='']");
  //   if ($blank_option.length) {
  //     spot.$input_field.attr("placeholder", $blank_option.text());
  //     spot.$input_field.val("");
  //     $blank_option.remove();
  //   };
  // 
  //   if (spot.spotlite_original_output === spot.output) {
  //     spot.output = function(e) {
  //       return $("<li />").html(e.text).data("spotlite-value", e.val);
  //     };
  //   }
  //   spot.multiselect = spot.$select.attr("multiple");
  //   spot.$input_field.bind("focus.spotlite", function() {
  //     if (spot.$select.find(":selected").val() && spot.display_matches_on_focus) {
  //       $(this).val("");
  //     }
  //   });
  // }
  // 
  // function generatePool(data) {
  //   var spot = this,
  //       terms = data ? data : spot.pool,
  //       pool = [],
  //       match_item = {},
  //       words = [],
  //       i, j, tl, wl, term;
  //   for (i = 0, tl = terms.length; i < tl; i++) {
  //     words = [];
  //     if (typeof terms[i] === "object") {
  //       parseTerm(words, terms[i]);
  //     } else {
  //       words = cleanSplit(terms[i]);
  //     }
  //     for (j = 0, wl = words.length; j < wl; j++) {
  //       match_item.term = terms[i];
  //       match_item.search_term = words.slice(j).join(" ").toLowerCase();
  //       pool.push($.extend({}, match_item));
  //     }
  //   }
  //   spot.pool = pool;
  // 
  //   function parseTerm(words, term) {
  //     for (t in term) {
  //       if (typeof term[t] === "object") {
  //         parseTerm(words, term[t]);
  //       }
  //       else {
  //         if (spot.bypass.length) {
  //           if ($.inArray(t, spot.bypass) == -1) {
  //             $.merge(words, cleanSplit(term[t]));
  //           }
  //         } else {
  //           $.merge(words, cleanSplit(term[t]));
  //         }
  //       }
  //     }
  //   }
  // 
  //   function cleanSplit(str) {
  //     return spot.sanitize($.trim(str)).split(" ");
  //   }
  // }
  // 
  // function populateMatches(ss) {
  //   var results = [],
  //       spot = this,
  //       new_cache = [],
  //       temp_term,
  //       val,
  //       item,
  //       clean_ss = spot.sanitize(ss).toLowerCase(),
  //       pool = spot.pool,
  //       current_results = [];
  //   spot.$result_list.find("li").each(function() {
  //     current_results.push($(this).text());
  //   });
  //   if(ss.length && spot.current_val != ss.substring(0, spot.current_val.length)) {
  //     pool = spot.cache;
  //   }
  //   spot.$match_list.children().remove();
  //   if (spot.display_matches_on_focus && !ss.length) {
  //     new_cache = spot.pool;
  //     for (var i = 0, j = spot.pool.length; i < j; i++) {
  //       item = spot.pool[i];
  //       if (typeof item.term === "object") {
  //         results.push(spot.output($.extend({}, item.term))[0]);
  //       } else {
  //         results.push(spot.output(item.term)[0]);
  //       }
  //     }
  //   } else {
  //     for (var k = 0, l = spot.pool.length; k < l; k++) {
  //       item = spot.pool[k];
  //       if ($.trim(clean_ss).length && clean_ss === $.trim(item.search_term).substring(0, ss.length)) {
  //         new_cache.push(item);
  //         if ((results.length < spot.match_limit || !spot.match_limit) &&
  //             ((spot.multiselect && $.inArray(item.term, current_results) < 0) || !spot.multiselect)) {
  //           if (typeof item.term === "object") {
  //             temp_term = $.extend({}, item.term);
  //             highlightTerm(spot, ss, temp_term);
  //             results.push(spot.output(temp_term)[0]);
  //           } else {
  //             results.push(spot.output(highlightInString.call(spot, ss, item.term))[0]);
  //           }
  //         }
  //       }
  //     }
  //   }
  //   if (results.length && ss.length || (spot.display_matches_on_focus && !ss.length)) {
  //     for (i = 0, j = results.length; i < j; i++) {
  //       var exact_matches = 0;
  //       spot.$result_list.add(spot.$match_list).find("li").map(function(k, v) {
  //         $(this).text() === $(results[i]).text() ? exact_matches++ : false;
  //       });
  //       if (!exact_matches) {
  //         spot.$match_list.append(results[i]);
  //       }
  //     }
  //     spot.before_match_display(spot.$match_list).children()
  //       .bind("mouseover.spotlite", function() {
  //         selectMatch.call(spot, $(this).index());
  //     }).bind("click.spotlite", function() {
  //       addMatch.call(spot, $(this));
  //     });
  //     spot.showMatches();
  //   } else {
  //     spot.$match_list.hide();
  //   }
  //   spot.match_count = results.length;
  //   return new_cache;
  // }
  // 
  // function highlightTerm(spot, ss, temp_term) {
  //   for (val in temp_term) {
  //     if (typeof temp_term[val] === "object") {
  //       highlightTerm(spot, ss, temp_term[val]);
  //     } else {
  //       temp_term[val] = highlightInString.call(spot, ss, temp_term[val]);
  //     }
  //   }
  // }
  // 
  // function selectMatch(num) {
  //   var spot = this;
  //   var $items = spot.$match_list.children();
  //   if ($items.length) {
  //     $items.removeClass(spot.class_prefix + "-selected").eq(num).addClass(spot.class_prefix + "-selected");
  //   }
  // }
  // 
  // function highlightInString(ss, term) {
  //   var spot = this;
  //   term = ' ' + term;
  //   var found = spot.sanitize(term).toLowerCase().indexOf(' ' + spot.sanitize(ss).toLowerCase());
  //   if (found < 0) {
  //     return $.trim(term);
  //   }
  //   var to_markup = term.substr(found + 1, ss.length);
  //   var start = term.substr(0, found + 1);
  //   var end = term.substr(found + 1 + ss.length);
  //   return $.trim(start + '<b class="' + spot.class_prefix + '-highlighted">' + to_markup + '</b>' + end);
  // }
  // 
  // function addMatch($el) {
  //   var spot = this;
  //   if (spot.multiselect) {
  //     var hl = $el.find('.' + spot.class_prefix + '-highlighted');
  //     spot.$result_list.append(removeOnClick($el.removeClass(spot.class_prefix + "-selected").unbind().detach()));
  //     spot.$select && spot.$select.length && spot.$select.find("[value='" + $el.data("spotlite-value") + "']").attr("selected", true);
  //     spot.$input_field.val('');
  //     spot.current_val = '';
  //   } else if ($el.length) {
  //     spot.$input_field.val($el.text()).change();
  //     spot.current_val = $el.text();
  //     $el.removeClass(spot.class_prefix + "-selected");
  //     if (spot.$select) {
  //       spot.$select.val($el.data("spotlite-value"));
  //     }
  //   }
  //   spot.$match_list.hide().children().detach();
  // }
  // 
  // function handleKeypress(e) {
  // 
  //   return handled;
  // }
  // 
  // function removeOnClick($el) {
  //   return $el.bind("click.spotlite", function() {
  //     $el.animate({ opacity: 0 }, {
  //       duration: 200,
  //       complete: function() {
  //         $el.slideUp(200, function() {
  //           if ($el.data("select")) {
  //             $el.data("select").find("[value='" + $el.data("spotlite-value") + "']").removeAttr("selected");
  //           }
  //           $el.remove();
  //         });
  //       }
  //     });
  //   });
  // }

})($ || jQuery || undefined);

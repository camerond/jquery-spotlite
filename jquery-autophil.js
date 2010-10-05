(function($) {

  $.fn.autophil = function(options) {
    var defaults = {
      class_prefix: 'af_',
      result_limit: 10
    };
    var opts = $.extend(defaults, options);
    var $autophil = $(this);
    var $pool = $autophil.find('dd ul.' + opts.class_prefix + 'pool');
    var $items = $pool.find('li');
    var $chosen = $('<ul />').addClass(opts.class_prefix + 'chosen').prependTo($autophil.find('dd'));
    var $input = $autophil.find('dd input');
    cleanList();
    positionPool();

    $(document).bind("click", function(e) {
      if($(e.target).parents().filter($autophil).length == 0) {
        $pool.hide();
      }
    });

    $items.click(function() {
      addResult($(this));
    });

    $items.mouseover(function() {
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
    });

    $input.bind('focusin click', function() {
      $pool.show();
      if($pool.find('li:visible').length == 0) {
        $pool.hide();
      }
    });

    $input.bind('focusout', function(e) {
      if($(e.target).parents().filter($autophil).length == 0) {
        $pool.hide();
      }
    });

    $input.live("keydown", function(e) {
      if (e.keyCode == 13) {
        e.preventDefault();
        addResult($pool.find('li.active:visible'));
      } else if (e.keyCode == 27) {
        clearAll();
      }
    });

    $input.live("keyup", function(e) {

      var $active = $items.filter('.active:visible');
      var $prevActive = $active.prevAll(':visible');
      var $nextActive = $active.nextAll(':visible');


      if (e.keyCode == 38) {
        e.preventDefault();
        if($prevActive.length != 0) {
          $active.removeClass('active');
          $prevActive.eq(0).addClass('active');
        }
      } else if (e.keyCode == 40) {
        e.preventDefault();
        if($nextActive.length != 0) {
          $active.removeClass('active');
          $nextActive.eq(0).addClass('active');
        }
      } else if (e.keyCode != 13) {
        var searchstring = $(this).val();
        findMatches(searchstring) > 0 ? $pool.show() : $pool.hide();
        $active = $items.filter(':visible').eq(0).addClass('active');
      }
    });

    function cleanList() {
      $items.each(function() {
        var cleaned = $.trim($(this).text());
        $(this).text(cleaned);
      });
    }

    function findMatches(searchstring) {
      var matchCount = 0;
      $items.each(function() {
        var $item = $(this);
        $item.removeClass('active').hide();
        var comparison = $item.text().substring(0, searchstring.length);
        if(findMatch(searchstring, comparison, $item)) {
          var markedup = '<b>' + comparison + '</b>' + $item.text().substring(searchstring.length);
          $item.html(markedup);
          if($(this).siblings(':visible').length < opts.result_limit) {
            $(this).show();
            matchCount++;
          }
        } else {
          $(this).hide();
        }
      });
      return matchCount;
    }

    function findMatch(ss, comparison, $item) {
      if ((ss.length == 0) || (ss.toLowerCase() != comparison.toLowerCase())) {
        return false;
      }
      var matchFound = true;
      $chosen.find('li').each(function() {
        if($(this).text() == $item.text()) {
          matchFound = false;
        }
      });
      return matchFound;
    }

    function positionPool() {
      $pool.css({
        'top': $input.outerHeight() + $input.position().top - 1,
        'width': $input.innerWidth() - $pool.css('padding-left').replace('px', '') - $pool.css('padding-right').replace('px', '')
      });
    }

    function addResult($result) {
      if($result.length) {
        $result.clone().text($result.text()).appendTo($chosen).click(function() {
          removeResult($(this));
        });
        clearAll();
        positionPool();
      }
    }
    
    function removeResult($result) {
      $result.animate({
        opacity:0
      }, {
        duration: 100,
        complete: function() {
          $(this).slideUp(100, function() {
            $(this).remove();
            positionPool();
          });
        }
      });
      clearAll();
    }

    function clearAll() {
      $input.val('');
      $pool.find('li').removeClass('active').hide();
      $pool.hide();
    }

  };

})(jQuery);
    
    

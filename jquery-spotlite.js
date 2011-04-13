$(function() {
  $.fn.spotlite = function(data, $match_list, $result_list, options) {

    return this.each(function() {
      var defaults = {
        result_limit: 10
      };
      var opts = $.extend(defaults, options);
      var $spot = $(this);
      var $input = $spot.find("input[type='text']");
      $input.bind('keyup', function() {
        populateMatches.apply($match_list, [$(this).val(), data]);
      });

    });

  };

  function populateMatches(ss, data) {
    var $ul = $(this),
        results = [];
    if(!ss.length) return false;
    $ul.find('li').detach();
    for(var i = 0; i < data.length; i++) {
      if(ss.toLowerCase() == data[i].substring(0, ss.length).toLowerCase()) {
        results.push($('<li />').text(data[i])[0]);
      }
    }
    if (results.length) {
      $ul.append($(results));
    }
    return $ul;
  }

});

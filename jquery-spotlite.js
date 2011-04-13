(function($) {
  $.fn.spotlite = function(data, $results, options) {

    return this.each(function() {
      var defaults = {
        result_limit: 10
      };
      var opts = $.extend(defaults, options);
      var $spot = $(this);
      var $input = $spot.find("input[type='text']");
      var $matches = $("<ul />").appendTo($spot);

      $input.trigger('keyup change', function() {
        $matches.apply(populateMatches(data));
      });

    });

  };

  function populateMatches(data) {
    var $matches = $(this);
  }

})(jQuery);

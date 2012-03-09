;(function($) {

  $.fx.off = true;

  test("it is chainable", function() {
    ok(fireSpotlite().hide().show().attr("id", "spotlite-test"), "spotlite is invoked and visibility is toggled");
  });

  module("Displaying Matches");

  test("it displays matches when a letter is typed", function() {
    fireSpotlite();
    type("Ba");
    shouldSee("Barrett Larson");
    shouldSee("Bart Velazquez");
    shouldNotSee("Angie Hopkins");
  });

  test("it displays no matches when no matches are found", function() {
    fireSpotlite();
    type("Wil");
    shouldSeeMatchCount(2);
    expectAttribute(getMatches(), ":visible");
    type("w");
    shouldSeeMatchCount(0);
    expectAttribute(getMatches(), ":hidden");
  });

  test("it matches any word in a phrase", function() {
    fireSpotlite();
    type("Ba");
    shouldSeeMatchCount(4);
    shouldSee("Alonzo Bartlett");
    shouldSee("Barrett Larson");
    shouldSee("Josefa Jenna Barton");
    shouldNotSee("Sebastian Hilario Langley");
  });

  test("it re-searches on backspace", function() {
    fireSpotlite();
    type("Ve");
    shouldSeeMatchCount(3);
    shouldSee("Romeo Velez");
    shouldNotSee("Virgil Gomez");
    backspace();
    shouldSeeMatchCount(7);
    shouldSee("Romeo Velez");
    shouldSee("Virgil Gomez");
  });

  test("it is not case sensitive", function() {
    fireSpotlite();
    type("Ba");
    shouldSeeMatchCount(4);
    shouldSee("Alonzo Bartlett");
    backspace();
    type("A");
    shouldSeeMatchCount(4);
    shouldSee("Alonzo Bartlett");
  });

  test("it limits displayed matches to 10 by default", function() {
    fireSpotlite();
    type("E");
    shouldSeeMatchCount(10);
    shouldSee("Elaine Huff");
    shouldNotSee("Eliseo Mathew Oneal");
  });

  module("Highlighting Results");

  test("it highlights the first result", function() {
    fireSpotlite();
    type("Ba");
    shouldHighlight("Alonzo Bartlett");
  });

  test("highlight changes on hover", function() {
    fireSpotlite();
    type("Ba");
    getMatches().find('li:eq(2)').trigger("mouseover");
    shouldHighlight("Bart Velazquez");
    getMatches().find('li:eq(0)').trigger("mouseover");
    shouldHighlight("Alonzo Bartlett");
  });

  test("highlight next match with down arrow", function() {
    fireSpotlite();
    type("Ba");
    typeKeycode(40, "down");
    shouldHighlight("Barrett Larson");
    typeKeycode(40, "down");
    typeKeycode(40, "down");
    shouldHighlight("Josefa Jenna Barton");
    typeKeycode(40, "down");
    shouldHighlight("Josefa Jenna Barton");
  });

  test("highlight previous match with up arrow", function() {
    fireSpotlite();
    type("Ba");
    shouldHighlight("Alonzo Bartlett");
    typeKeycode(38, "up");
    shouldHighlight("Alonzo Bartlett");
    getMatches().find("li:eq(2)").trigger("mouseover");
    typeKeycode(38, "up");
    shouldHighlight("Barrett Larson");
  });

  test("hide matches on escape", function() {
    fireSpotlite();
    type("Ba");
    typeKeycode(27, "esc");
    shouldSeeMatchCount(4);
    expectAttribute(getMatches(), ":hidden");
  });

  test("show matches on focus", function() {
    fireSpotlite();
    getInput().trigger("focus");
    expectAttribute(getMatches(), ":hidden");
    type("Ba");
    expectAttribute(getMatches(), ":visible");
    typeKeycode(27, "esc");
    expectAttribute(getMatches(), ":hidden");
    getInput().trigger("focus");
    expectAttribute(getMatches(), ":visible");
  });

  test("hide matches on outside click", function() {
    var $spot = fireSpotlite();
    type("Ba");
    $spot.find("input[type='text']").trigger("click");
    expectAttribute(getMatches(), ":visible");
    $("#outer").trigger("click");
    expectAttribute(getMatches(), ":hidden");
  });

  module("Interacting With Matches");

  test("it attaches the matched item to the results on enter", function() {
    fireSpotlite();
    type("Ba");
    typeKeycode(13, "enter");
    shouldSeeResult("Alonzo Bartlett");
    shouldSeeMatchCount(0);
    expectAttribute(getMatches(), ":hidden");
    equal(getInput().val(), "", "Input is clear");
  });

  test("it attaches the matched item to the results on tab", function() {
    fireSpotlite();
    type("Ba");
    typeKeycode(9);
    shouldSeeResult("Alonzo Bartlett");
    shouldSeeMatchCount(0);
    expectAttribute(getMatches(), ":hidden");
    equal(getInput().val(), "", "Input is clear");
  });

  test("it attaches the matched item to the results on click", function() {
    fireSpotlite();
    type("Ba");
    getMatches().find("li.spotlite-selected").click();
    shouldSeeResult("Alonzo Bartlett");
    shouldSeeMatchCount(0);
    expectAttribute(getMatches(), ":hidden");
    equal(getInput().val(), "", "Input is clear");
  });

  test("it does not show matches that have already been added", function() {
    fireSpotlite();
    type("Ba");
    shouldSee("Alonzo Bartlett");
    getMatches().find("li.spotlite-selected").click();
    shouldSeeResult("Alonzo Bartlett");
    type("Ba");
    shouldNotSee("Alonzo Bartlett");
    shouldSee("Barrett Larson");
  });

  test("it does show unique matches that encompass one another's terms", function() {
    var data_with_similar = getDefaultData();
    data_with_similar.splice(1, 0, "Alonzo");
    $("#spotlite-test").spotlite({
      pool: data_with_similar
    });
    type("Alonzo");
    shouldSee("Alonzo Bartlett");
    shouldSee("Alonzo");
    typeKeycode(13, "Enter");
    getInput().trigger("focus");
    type("a");
    shouldSee("Alonzo Bartlett");
    shouldSeeResult("Alonzo");
    ok(getMatches().find("li").eq(1).text() === "Alonzo Bartlett", "The second match is now Alonzo Bartlett");
  });

  test("it removes the result on click", function() {
    fireSpotlite();
    type("Ba");
    typeKeycode(13);
    getResults().find("li").click();
    shouldSeeResultCount(0);
  });

  test("it properly handles matching of items already in result list", function() {
    getMain().append($("<ul />", { "class" : "spotlite-results" }));
    getResults().append($("<li />").text("Eddy Ray"));
    getResults().append($("<li />").text("Sarah Edna Fitzpatrick"));
    fireSpotlite();
    type("ed");
    shouldSeeResultCount(2);
  });

  test("it properly handles removal of items already in result list", function() {
    getMain().append($("<ul />", { "class" : "spotlite-results" }));
    getResults().append($("<li />").text("foo"));
    getResults().append($("<li />").text("bar"));
    fireSpotlite();
    shouldSeeResultCount(2);
    getResults().find("li:first").click();
    shouldSeeResultCount(1);
  });

  test("it bolds the matched elements of a word/phrase", function() {
    fireSpotlite();
    type("ba");
    getMatches().find("li").each(function() {
      var $li = $(this);
      equal($li.find('b').text(), "Ba", "'Ba' is bolded for " + $li.text());
    });
  });

  test("it bolds the matched elements of a word/phrase across words", function() {
    fireSpotlite();
    type("Alonzo Bar");
    getMatches().find("li").each(function() {
      var $li = $(this);
      equal($li.find('b').text(), "Alonzo Bar", "'Alonzo Bar' is bolded for " + $li.text());
    });
  });

  test("it handles multiple Spotlites on a page", function() {
    var $spot1 = $("#spotlite-test");
    var $spot2 = $("<div />").attr("id", "#spotlite-test-2");
    $spot2.html($spot1.html()).insertAfter($("#spotlite-test")).spotlite({ pool: getDefaultData() });
    fireSpotlite();
    type("ba");
    shouldSee("Alonzo Bartlett");
    type("za", $spot2.find(":input"));
    shouldSee("Zack Leslie Hicks");
    $spot1.find(":input").trigger("focus");
    shouldSee("Alonzo Bartlett");
  });

  module("Options");

  test("adjust number of displayed matches", function() {
    fireSpotlite({ match_limit: 2 });
    type("a");
    shouldSeeMatchCount(2);
  });

  test("display all matches if match limit is 0", function() {
    fireSpotlite({ match_limit: 0 });
    type("r");
    shouldSeeMatchCount(17);
  });

  test("display all matches on focus if input is blank", function() {
    fireSpotlite({
      match_limit: 0,
      display_matches_on_focus: true
    });
    getInput().trigger("focus");
    shouldSeeMatchCount(100);
    type("r");
    shouldSeeMatchCount(17);
    $("body").click();
    expectAttribute(getMatches(), ":hidden");
  });

  test("fill input intead of adding match to result list", function() {
    fireSpotlite({ multiselect: false });
    type("jos");
    shouldSeeMatchCount(5);
    var $li = getMatches().find("li:eq(2)").trigger("click");
    equal(getInput().val(), "Joseph Walters", "'Joseph Walters' is now the value of the input field");
    backspace(11);
    shouldSeeMatchCount(5);
    $li = getMatches().find("li:eq(2)");
    typeKeycode(13, "Enter");
    equal(getInput().val(), "Josefa Jenna Barton", "'Josefa Jenna Barton' is now the value of the input field");
    typeKeycode(13, "Enter");
    equal(getInput().val(), "Josefa Jenna Barton", "Input field stays chosen after enter keypress");
  });

  test("min. number of characters before search", function() {
    fireSpotlite({ threshold: 3 });
    type("b");
    shouldSeeMatchCount(0);
    type("a");
    shouldSeeMatchCount(0);
    type("r");
    shouldSeeMatchCount(4);
  });

  test("custom class prefix", function() {
    var $spot = fireSpotlite({ class_prefix: "foo" });
    type("Ba");
    ok($("body > .foo-matches").find("li.foo-selected:contains('Ba')").length === 1, "'Ba' is the highlighted result");
    typeKeycode(13, "enter");
    ok($spot.find("li:contains('Alonzo Bartlett')").length, "I should see 'Alonzo Bartlett'" );
  });

  test("exclude certain characters", function() {
    var special_data = ['(marty@mcfly.com)', '(doc@brown.com)', '(twin@pines.com)', '(teen@wolf.com)', '(delorean@flying.com)'];
    fireSpotlite({ pool: special_data });
    type("marty");
    shouldSeeMatchCount(1);
    shouldSee("(marty@mcfly.com)");
    type("@");
    shouldSeeMatchCount(1);
    backspace(6);
    type("mcfly");
    shouldSeeMatchCount(1);
    QUnit.reset();
    fireSpotlite({
      pool: special_data,
      exclude_characters: '[()]'
    });
    type("(");
    shouldSeeMatchCount(0);
    backspace();
    type("marty@");
    shouldSeeMatchCount(1);
  });

  test("allow custom output function", function() {
    fireSpotlite({
      output: function(e) {
        return $("<p />").html(e);
      }
    });
    type("Ba");
    equal(getMatches().find('p:eq(0)').text(), "Alonzo Bartlett", "Custom output function wraps match in paragraph");
  });

  test("allow adjustment of match list through callback", function() {
    fireSpotlite({
      before_match_display: function($ul) {
        $.fn.reverse = [].reverse;
        return $ul.html($ul.children().reverse());
      }
    });
    type("ar");
    equal(getMatches().find("li:eq(0)").text(), "Elmer Aron Preston", "Reverse match list with callback");
    getMatches().find(".spotlite-highlighted").click();
    shouldSeeResult("Elmer Aron Preston");
  });

  test("allow array of objects as data", function() {
    fireSpotlite({
      pool: getObjectData(),
      output: function(e) {
        var i = $("<span />");
        var el = $("<li />");
        i.html(e.email);
        el.html(e.full_name);
        return el.append(i);
      }
    });
    type("w");
    shouldSeeMatchCount(1);
    equal(getMatches().find("li span b.spotlite-highlighted").text(), "w", "Should return formatted result");
    backspace();
    type("great");
    shouldSeeMatchCount(1);
    equal(getMatches().find("li span b.spotlite-highlighted").text(), "great", "Should find email and return formatted result");
  });

  test("exclude certain object attributes from being used in matching algorithm", function() {
    fireSpotlite({
      pool: getImageData(),
      bypass: "img, thumb",
      output: function(e) {
        return $("<li />")
          .html(e.full_name)
          .append($("<img />", {src: e.img}));
      }
    });
    type("http");
    shouldSeeMatchCount(0);
    backspace(4);
    type("b");
    shouldSeeMatchCount(2);
    equal(getMatches().find("li:eq(0) img").attr("src"), "http://dummyimage.com/20x20", "Should display image tags for results");
  });

  test("load JSON from URL", function() {
    fireSpotlite({
      pool: "/javascript/test_data.json",
      output: function(e) {
        var i = $("<span />");
        var el = $("<li />");
        i.html(e.email);
        el.html(e.full_name);
        return el.append(i);
      }
    });
    stop();
    setTimeout(function() {
      type("marty");
      shouldSeeMatchCount(1);
      start();
    }, 200);
  });

  test("parse and search through embedded objects", function() {
    fireSpotlite({
      pool: "/javascript/test_data.json",
      output: function(e) {
        var i = $("<span />");
        var el = $("<li />");
        i.html(e.email);
        el.html(e.full_name);
        if (e.features) {
          var j = $("<span />");
          j.html(e.features.hair);
          i.append(j);
        }
        return el.append(i);
      }
    });
    stop();
    setTimeout(function() {
      type("wavy");
      shouldSeeMatchCount(1);
      start();
    }, 200);
  });

  var initSelect = function() {
    getInput().replaceWith($("<select />"));
    var $select = $("#spotlite-test select");
    var names = ["Doc Brown", "George McFly", "Marty McFly", "Biff"];
    for (i in names) {
      $("<option />").text(names[i]).attr("value", i).appendTo($select);
    }
    return $select;
  };

  test("fire spotlite on select tag", function() {
    var $select = initSelect();
    $("#spotlite-test").spotlite();
    equal(getInput().val(), "Doc Brown", "'Doc Brown' is the initial value of the input tag");
    backspace(9);
    type("mc");
    shouldSee("George McFly");
    shouldSee("Marty McFly");
    shouldNotSee("Doc Brown");
    typeKeycode(13, "enter");
    equal($select.val(), "1", "'George McFly (value 1) is now the value of the select tag");
    equal(getInput().val(), "George McFly", "'George McFly' is now the value of the input field");
  });

  test("ignore value attribute on option tags", function() {
    var $select = initSelect();
    $("#spotlite-test").spotlite();
    getInput().trigger("focus");
    type("1");
    shouldSeeMatchCount(0);
  });

  test("handle placeholder in select tag", function() {
    var $select = initSelect();
    $("<option />").attr("value", "").text("select a name ...").prependTo($select);
    $("#spotlite-test").spotlite();
    equal(getInput().attr("placeholder"), "select a name ...", "The placeholder attribute is properly assigned to the input tag");
  });

  test("recognize initially selected value in select tag", function() {
    var $select = initSelect();
    $select.find("option").eq(1).attr("selected", "selected");
    $("#spotlite-test").spotlite();
    equal(getInput().val(), "George McFly", "'George McFly' is now the value of the input field");
  });

  test("when displaying on focus, remember currently selected value on outside click", function() {
    var $select = initSelect();
    $("#spotlite-test").spotlite({ display_matches_on_focus: true });
    equal(getInput().val(), "Doc Brown", "'Doc Brown' is the initial value of the input field");
    getInput().trigger("focus");
    equal(getInput().val(), "", "input tag clears on focus");
    $("#outer").click();
    equal(getInput().val(), "Doc Brown", "'Doc Brown' is restored after blur");
  });

  test("when displaying on focus, remember currently selected value on esc", function() {
    var $select = initSelect();
    $("#spotlite-test").spotlite({ display_matches_on_focus: true });
    getInput().trigger("focus");
    equal(getInput().val(), "", "input tag clears on focus");
    typeKeycode(27, "esc");
    equal(getInput().val(), "Doc Brown", "'Doc Brown' is restored after blur");
  });

  test("when displaying on focus, remember currently selected value in match list on focus", function() {
    var $select = initSelect();
    $("#spotlite-test").spotlite({ display_matches_on_focus: true });
    $select.find("option").eq(1).attr("selected", "selected");
    getInput().trigger("focus");
    shouldHighlight("George McFly");
  });

  test("handle display_matches_on_focus when converting from select tag", function() {
    var $select = initSelect();
    $("#spotlite-test").spotlite({ display_matches_on_focus: true });
    getInput().trigger("focus");
    shouldSee("Doc Brown");
    type("mc");
    shouldNotSee("Doc Brown");
    shouldHighlight("George McFly");
    typeKeycode(13, "enter");
    equal($select.val(), "1", "'George McFly (value 1) is now the value of the select tag");
    equal(getInput().val(), "George McFly", "'George McFly' is now the value of the input field");
  });

  test("fire spotlite on multiselect tag", function() {
    var $select = initSelect();
    $("<option />").attr("value", "").text("select a name ...").prependTo($select);
    $select.attr("multiple", "true");
    $("#spotlite-test").spotlite();
    type("doc");
    typeKeycode(13, "enter");
    expectAttribute($select.find("option:contains('Doc')"), ":selected");
    shouldSeeResult("Doc Brown");
    equal(getInput().val(), "", "Input is blank after selecting an item");
    getInput().trigger("focus");
    type("g");
    shouldSee("George McFly");
    typeKeycode(13, "enter");
    expectAttribute($select.find("option:contains('George')"), ":selected");
  });

  var module_opts = {
    multiselect: false,
    ajax: true,
    ajax_opts: {
      url: "/javascript/people.json",
      method: "get",
      success: function(json, text, xhr) {
        var cb_type = " success callback";
        ok(true, "Fires" + cb_type);
        ok($.isArray(json), "Matches array returned in" + cb_type);
        ok(this.is(":input"), "Context is input in" + cb_type);
        ok(typeof text === "string", "Text response is string in" + cb_type);
        ok("abort" in xhr, "XHR object passed in" + cb_type);
      },
      complete: function(xhr, text) {
        var cb_type = " complete callback";
        ok(true, "Fires" + cb_type);
        ok(this.is(":input"), "Context is input in" + cb_type);
        ok(typeof text === "string", "Text response is string in" + cb_type);
        ok("abort" in xhr, "XHR object passed in" + cb_type);
      },
      error: function(xhr, text, error) {
        var cb_type = " error callback";
        ok(true, "Fires" + cb_type);
        ok(this.is(":input"), "Context is input in" + cb_type);
        ok(typeof text === "string", "Text response is string in" + cb_type);
        ok("abort" in xhr, "XHR object passed in" + cb_type);
      }
    }
  };
  module("Ajax", {
    setup: function() {
      fireSpotlite(module_opts);
    }
  });

  test("should find 1 result", function() {
    stop();
    type("z");
    setTimeout(function() {
      shouldSeeMatchCount(1);
      start();
    }, 200);
  });
  test("should filter from 5 to 1 result", function() {
    stop();
    type("el");
    setTimeout(function() {
      shouldSeeMatchCount(5);
      start();
      stop();
      type("t");
      setTimeout(function() {
        shouldSeeMatchCount(1);
        start();
      }, 200);
    }, 200);
  });
  test("should not return results", function() {
    stop();
    type("axy");
    setTimeout(function() {
      shouldSeeMatchCount(0);
      module_opts.ajax_opts.url = "/nonexistent";
      start();
    }, 200);
  });
  test("should fire error callback", function() {
    stop();
    type("a");
    setTimeout(start, 200);
  });

  module("Methods");

  test("refresh", function() {
    var data = getDefaultData();
    fireSpotlite();
    data.push("Billy Dee Williams");
    $("[id$='-test']").spotlite('refresh', {pool: data});
    type("dee");
    shouldSee("Billy Dee Williams");
  });

  function getMain() {
    return $("#spotlite-test");
  }

  function getInput() {
    return getMain().find("input[type='text']");
  }

  function getMatches() {
    return $("body > ul.spotlite-matches");
  }

  function getResults() {
    return getMain().find(".spotlite-results");
  }

  function fireSpotlite(options) {
    var opts = $.extend({
      pool: getDefaultData()
    }, options);
    return $("#spotlite-test").spotlite(opts);
  }

  function type(str, $input) {
    ok(true, "I type '" + str + "'");
    if (!$input) {
      $input = getInput();
    }
    var s = str.split('');
    for (var i = 0, ln = s.length; i < ln; i++) {
      var $e = $.Event('keyup');
      $e.keyCode = str.charCodeAt(s[i]);
      $input.val($input.val() + s[i]);
      $input.trigger($e);
    }
  }

  function typeKeycode(k, msg) {
    if (msg) {
      ok(true, "I press '" + msg + "'");
    }
    var $input = getInput();
    var $e = $.Event('keydown');
    $e.keyCode = k;
    $input.trigger($e);
  }

  function backspace(num) {
    if (!num) { num = 1; }
    var $input = getInput();
    for (var i = 0; i < num; i++) {
      $input.val($input.val().slice(0, -1));
      $input.trigger('keyup');
    }
    ok(true, "I type a backspace x " + num);
  }

  function expectAttribute($el, attr) {
    return ok($el.is(attr), $el.selector + " should be " + attr);
  }

  function shouldSee(str) {
    return ok(getMatches().find("li:contains('" + str + "')").length, "I should see " + str);
  }

  function shouldNotSee(str) {
    return equal(getMatches().find("li:contains('" + str + "')").length, 0, "I should not see " + str);
  }

  function shouldSeeResult(str) {
    return ok(getResults().find("li:contains('" + str + "')").length, "I should see " + str);
  }

  function shouldSeeMatchCount(num) {
    return equal(getMatches().find("li").length, num, "I should see " + num + " matches");
  }

  function shouldSeeResultCount(num) {
    return equal(getResults().find("li").length, num, "I should see " + num + " results");
  }

  function shouldHighlight(str) {
    var selected = getMatches().find("li.spotlite-selected:contains('" + str + "')");
    return ok(selected.length === 1, "'" + str + "' is the highlighted result");
  }

  function getDefaultData() {
    return ["Alfredo Elton Lindsey",
    "Alonzo Bartlett",
    "Amalia Oliver",
    "Angie Hopkins",
    "Antonio Vaughan",
    "Arron Conrad Sweeney",
    "Art Harmon",
    "Barrett Larson",
    "Bart Velazquez",
    "Bernadine Goodman",
    "Blanche Emily Burch",
    "Bobbie Tate",
    "Brianna Juliet Chavez",
    "Bridgette Villarreal",
    "Cameron Van Sutton",
    "Charlotte Coleen Edwards",
    "Clayton Phillips",
    "Cora Pennington",
    "Cornelia King",
    "Curt Peters",
    "Deirdre Goldie Estes",
    "Deirdre Sherrie Becker",
    "Devin Larson",
    "Diego Kim",
    "Donna Maryellen Glenn",
    "Earl Garrett",
    "Earle Wiggins",
    "Eddy Ray",
    "Edmund Ulysses Haynes",
    "Efrain Sharp",
    "Elaine Huff",
    "Eliseo Mathew Oneal",
    "Elmer Aron Preston",
    "Enoch Garcia",
    "Errol Dixon",
    "Estella Dixon",
    "Ester Abigail Lancaster",
    "Ethel Cathryn Burgess",
    "Eunice Tonya Flowers",
    "Fanny Meadows",
    "Felecia Norton",
    "Franklyn Juarez",
    "Freida Finley",
    "Gwen Tonya Olsen",
    "Harlan Richardson",
    "Hilda Shaffer",
    "Hugo Marcelo Estes",
    "Ina Tonya Cervantes",
    "Isabel Mindy Huff",
    "Jamal Cruz Merrill",
    "Janice Ayers",
    "Josefa Jenna Barton",
    "Josefa Richards",
    "Joseph Walters",
    "Jospeh Louis Spencer",
    "Lakisha Kristine Doyle",
    "Laurel Levine",
    "Lawrence Tate",
    "Leona Maxine Hampton",
    "Leonel Roman",
    "Leroy Atkins",
    "Lottie Catalina Hogan",
    "Luella Sims",
    "Mable Thompson",
    "Marcel Horn",
    "Marlene Jayne Green",
    "Mattie Aimee Goff",
    "Maureen Madeleine Stevens",
    "Max York",
    "Millard Brooks",
    "Odell Kerry Rosa",
    "Rachel Bray",
    "Ramiro Rivas",
    "Randi Etta Fulton",
    "Reva Karina Ferguson",
    "Rico Minh Mcdonald",
    "Robyn Joseph",
    "Romeo Velez",
    "Rosetta Marilyn Kennedy",
    "Roxanne Belinda Ewing",
    "Rudolf Harold Leach",
    "Sarah Edna Fitzpatrick",
    "Sebastian Hilario Langley",
    "Seth Hyde",
    "Shana Browning",
    "Sharlene Earlene Guzman",
    "Sheryl Elsa Suarez",
    "Sid Damion Gonzalez",
    "Stephen Reyes Stanley",
    "Susan Leann Page",
    "Susana Wynn",
    "Thanh Haney",
    "Theodore Soto",
    "Tonia Melisa Carney",
    "Tyree Green",
    "Vera Karin Reeves",
    "Virgil Gomez",
    "Williams Burgess",
    "Williams Mitch Floyd",
    "Zack Leslie Hicks"];
  }

  function getObjectData() {
    return [
      { full_name: "Marty McFly", email: "marty@mcfly.com" },
      { full_name: "Doc Brown", email: "great@scott.com" },
      { full_name: "Biff", email: "makelikea@tree.com" },
      { full_name: "Crispin Glover", email: "whatisit@willard.com" }
    ];
  }

  function getImageData() {
    return [
      { full_name: "Marty McFly", img: "http://dummyimage.com/10x10", thumb: "http://dummyimage.com/1x1" },
      { full_name: "Doc Brown", img: "http://dummyimage.com/20x20", thumb: "http://dummyimage.com/2x2" },
      { full_name: "Biff", img: "http://dummyimage.com/30x30", thumb: "http://dummyimage.com/3x3" },
      { full_name: "Crispin Glover", img: "http://dummyimage.com/40x40", thumb: "http://dummyimage.com/4x4" }
    ];
  }

})(jQuery);

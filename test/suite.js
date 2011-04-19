$(function() {

  test("it is chainable", function() {
    same(fireSpotlite().hide().show(), $("#spotlite-test"));
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
    expectAttribute($("ul#spotlite-test-matches"), ":visible");
    type("w");
    shouldSeeMatchCount(0);
    expectAttribute($("ul#spotlite-test-matches"), ":hidden");
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
    var $matches = $("ul#spotlite-test-matches");
    fireSpotlite();
    type("Ba");
    $matches.find('li:eq(2)').trigger("mouseover");
    shouldHighlight("Bart Velazquez");
    $matches.find('li:eq(0)').trigger("mouseover");
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
    var $matches = $("ul#spotlite-test-matches");
    fireSpotlite();
    type("Ba");
    shouldHighlight("Alonzo Bartlett");
    typeKeycode(38, "up");
    shouldHighlight("Alonzo Bartlett");
    $matches.find("li:eq(2)").trigger("mouseover");
    typeKeycode(38, "up");
    shouldHighlight("Barrett Larson");
  });

  test("hide matches on escape", function() {
    fireSpotlite();
    type("Ba");
    typeKeycode(27, "esc");
    shouldSeeMatchCount(4);
    expectAttribute($("ul#spotlite-test-matches"), ":hidden");
  });

  test("show matches on focus", function() {
    fireSpotlite();
    getInput().trigger("focus");
    expectAttribute($("ul#spotlite-test-matches"), ":hidden");
    type("Ba");
    expectAttribute($("ul#spotlite-test-matches"), ":visible");
    typeKeycode(27, "esc");
    expectAttribute($("ul#spotlite-test-matches"), ":hidden");
    getInput().trigger("focus");
    expectAttribute($("ul#spotlite-test-matches"), ":visible");
  });

  test("hide matches on outside click", function() {
    var $spot = fireSpotlite();
    type("Ba");
    $spot.find("input[type='text']").trigger("click");
    expectAttribute($("ul#spotlite-test-matches"), ":visible");
    $("<div />").appendTo("body").trigger("click");
    expectAttribute($("ul#spotlite-test-matches"), ":hidden");
  });

  module("interacting with matches");

  test("it attaches the matched item to the results on enter", function() {
    fireSpotlite();
    type("Ba");
    typeKeycode(13);
    shouldSeeResult("Alonzo Bartlett");
    shouldSeeMatchCount(0);
    expectAttribute($("ul#spotlite-test-matches"), ":hidden");
    equal(getInput().val(), "", "Input is clear");
  });

  test("it attaches the matched item to the results on tab", function() {
    fireSpotlite();
    type("Ba");
    typeKeycode(9);
    shouldSeeResult("Alonzo Bartlett");
    shouldSeeMatchCount(0);
    expectAttribute($("ul#spotlite-test-matches"), ":hidden");
    equal(getInput().val(), "", "Input is clear");
  });

  test("it attaches the matched item to the results on click", function() {
    fireSpotlite();
    type("Ba");
    $("ul#spotlite-test-matches li.spotlite-selected").click();
    shouldSeeResult("Alonzo Bartlett");
    shouldSeeMatchCount(0);
    expectAttribute($("ul#spotlite-test-matches"), ":hidden");
    equal(getInput().val(), "", "Input is clear");
  });

  test("it removes the result on click", function() {
    fireSpotlite();
    type("Ba");
    typeKeycode(13);
    $("ul#spotlite-test-results li").click();
    shouldSeeResultCount(0);
  });

  test("it bolds the matched elements of a word/phrase", function() {
    fireSpotlite();
    type("Ba");
    $("ul#spotlite-test-matches li").each(function() {
      var $li = $(this);
      equal($li.find('b').text(), "Ba", "'Ba' is bolded for " + $li.text());
    });
  });

  test("it bolds the matched elements of a word/phrase across words", function() {
    fireSpotlite();
    type("Alonzo Bar");
    $("ul#spotlite-test-matches li").each(function() {
      var $li = $(this);
      equal($li.find('b').text(), "Alonzo Bar", "'Alonzo Bar' is bolded for " + $li.text());
    });
  });


  // module: options

  // option: adjust number of displayed matches

  // option: custom class names

  // option: delay before searching

  // option: min. number of characters before search

  function getMain() {
    return $("#spotlite-test");
  }

  function getInput() {
    return getMain().find("input[type='text']");
  }

  function fireSpotlite(data, options) {
    if (!data) {
      data = getDefaultData();
    }
    return $("#spotlite-test").spotlite(data, $("#spotlite-test-matches"), $("#spotlite-test-results"), options);
  }

  function type(str) {
    ok(true, "I type '" + str + "'");
    var $input = getInput();
    for (var i = 0; i < str.length; i++) {
      var $e = $.Event('keydown');
      $e.keyCode = str.charCodeAt(str[i]);
      $input.val($input.val() + str[i]);
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

  function backspace() {
    ok(true, "I type a backspace");
    var $input = getInput();
    $input.val($input.val().slice(0, -1));
    $input.keyCode = 8;
    $input.trigger('keydown');
  }

  function expectAttribute($el, attr) {
    return ok($el.is(attr), $el.selector + " should be " + attr);
  }

  function shouldSee(str) {
    return ok($("#spotlite-test-matches").find("li:contains('" + str + "')").length, "I should see " + str);
  }

  function shouldNotSee(str) {
    return equal($("#spotlite-test-matches").find("li:contains('" + str + "')").length, 0, "I should not see " + str);
  }

  function shouldSeeResult(str) {
    return ok($("#spotlite-test-results").find("li:contains('" + str + "')").length, "I should see " + str);
  }

  function shouldSeeMatchCount(num) {
    return equal($("#spotlite-test-matches").find("li").length, num, "I should see " + num + " matches");
  }

  function shouldSeeResultCount(num) {
    return equal($("#spotlite-test-results").find("li").length, num, "I should see " + num + " results");
  }

  function shouldHighlight(str) {
    var $matches = $("#spotlite-test-matches");
    var selected = $matches.find("li.spotlite-selected:contains('" + str + "')");
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

});

$(function() {

  test("it is chainable", function() {
    same(fireSpotlite().hide().show(), $("#spotlite-test"));
  });
  
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
    type("w");
    shouldSeeMatchCount(0);
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
    type("V");
    shouldSeeMatchCount(7);
    shouldSee("Romeo Velez");
    shouldSee("Virgil Gomez");
    type("e");
    shouldSeeMatchCount(3);
    shouldSee("Romeo Velez");
    shouldNotSee("Virgil Gomez");
    backspace();
    shouldSeeMatchCount(7);
    shouldSee("Romeo Velez");
    shouldSee("Virgil Gomez");
  });

  test("it limits displayed matches to 10 by default", function() {
    var v = fireSpotlite();
    type("E");
    shouldSeeMatchCount(10);
    shouldSee("Elaine Huff");
    shouldNotSee("Eliseo Mathew Oneal");
  });

  test("it highlights the first result", function() {
    fireSpotlite();
    type("Ba");
    shouldSee("Alonzo Bartlett");
    shouldSee("Bart Velazquez");
    shouldHighlight("Alonzo Bartlett");
  });

  // it attaches the matched word to the results on enter

  // it attaches the matched word to the results on click

  // it hides the suggestions on esc

  // it is not case sensitive

  // it bolds the matched elements of a word/phrase

  // option: adjust number of displayed matches

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
    for(var i = 0; i < str.length; i++) {
      $input.val($input.val() + str[i]);
      $input.trigger('keyup');
    }
  }

  function backspace() {
    ok(true, "I type a backspace");
    var $input = getInput();
    $input.val($input.val().slice(0, -1));
    $input.trigger('keyup');
  }

  function shouldSee(str) {
    return ok($("#spotlite-test-matches").find('li:visible:contains("' + str + '")').length, "I should see " + str);
  }

  function shouldNotSee(str) {
    return equal($("#spotlite-test-matches").find('li:visible:contains("' + str + '")').length, 0, "I should not see " + str);
  }

  function shouldSeeMatchCount(num) {
    return equal($("#spotlite-test-matches").find("li:visible").length, num, "I should see " + num + " matches");
  }

  function shouldHighlight(str) {
    var $matches = $("#spotlite-test-matches");
    console.log($matches);
    var selected = $matches.find("li.spotlite-selected:contains('" + str + "')");
    return ok(selected.length == 1, "'" + str + "' is the highlighted result");
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

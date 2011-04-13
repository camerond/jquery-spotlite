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

  // it displays no matches when no matches are found

  // it re-searches after each time the field value changes (incl. backspace)

  // it limits displayed matches to 10 by default

  // it attaches the matched word to the results on enter

  // it attaches the matched word to the results on click

  // it hides the suggestions on esc

  // it is not case sensitive

  // it matches any word in a phrase

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
      data = ["Amalia Oliver","Angie Hopkins","Bernadine Goodman","Blanche Emily Burch","Brianna Juliet Chavez","Bridgette Villarreal","Charlotte Coleen Edwards","Cora Pennington","Cornelia King","Deirdre Goldie Estes","Deirdre Sherrie Becker","Donna Maryellen Glenn","Elaine Huff","Estella Dixon","Ester Abigail Lancaster","Ethel Cathryn Burgess","Eunice Tonya Flowers","Fanny Meadows","Felecia Norton","Freida Finley","Gwen Tonya Olsen","Hilda Shaffer","Ina Tonya Cervantes","Isabel Mindy Huff","Janice Ayers","Josefa Jenna Barton","Josefa Richards","Lakisha Kristine Doyle","Laurel Levine","Leona Maxine Hampton","Lottie Catalina Hogan","Luella Sims","Mable Thompson","Marlene Jayne Green","Mattie Aimee Goff","Maureen Madeleine Stevens","Rachel Bray","Randi Etta Fulton","Reva Karina Ferguson","Robyn Joseph","Rosetta Marilyn Kennedy","Roxanne Belinda Ewing","Sarah Edna Fitzpatrick","Shana Browning","Sharlene Earlene Guzman","Sheryl Elsa Suarez","Susan Leann Page","Susana Wynn","Tonia Melisa Carney","Vera Karin Reeves","Alfredo Elton Lindsey","Alonzo Bartlett","Antonio Valentin Vaughan","Arron Conrad Sweeney","Art Harmon","Barrett Larson","Bart Velazquez","Bobbie Tate","Cameron Van Sutton","Clayton Phillips","Curt Peters","Devin Larson","Diego Kim","Earl Garrett","Earle Wiggins","Eddy Ray","Edmund Ulysses Haynes","Efrain Sharp","Eliseo Mathew Oneal","Elmer Aron Preston","Enoch Garcia","Errol Dixon","Franklyn Juarez","Harlan Richardson","Hugo Marcelo Estes","Jamal Cruz Merrill","Joseph Walters","Jospeh Louis Spencer","Lawrence Tate","Leonel Roman","Leroy Atkins","Marcel Horn","Max York","Millard Brooks","Odell Kerry Rosa","Ramiro Rivas","Rico Minh Mcdonald","Romeo Velez","Rudolf Harold Leach","Sebastian Hilario Langley","Seth Hyde","Sid Damion Gonzalez","Stephen Reyes Stanley","Thanh Haney","Theodore Soto","Tyree Green","Virgil Gomez","Williams Burgess","Williams Mitch Floyd","Zack Leslie Hicks"];
    }
    data.sort();
    return $("#spotlite-test").spotlite(data, $("#spotlite-test-matches"), $("#spotlite-test-results"), options);
  }

  function type(str) {
    ok(true, "I type '" + str + "'");
    var $input = getInput();
    for(var i = 0; i < str.length; i++) {
      $input.val($input.val() + str[i]);
      var e = $.Event("keyup");
      e.which = str.charCodeAt(i);
      $input.trigger(e);
    }
  }

  function backspace() {
    ok(true, "I type a backspace");
    var $input = getInput();
    $input.val($input.val().slice(0, -1));
  }

  function shouldSee(str) {
    return ok($("#spotlite-test-matches").find('li:visible:contains("' + str + '")').length, "I should see " + str);
  }

  function shouldNotSee(str) {
    return equal($("#spotlite-test-matches").find('li:visible:contains("' + str + '")').length, 0, "I should not see " + str);
  }

});

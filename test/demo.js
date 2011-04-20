$(function() {

  var demo_data = ["Amalia Oliver","Angie Hopkins","Bernadine Goodman","Blanche Emily Burch","Brianna Juliet Chavez","Bridgette Villarreal","Charlotte Coleen Edwards","Cora Pennington","Cornelia King","Deirdre Goldie Estes","Deirdre Sherrie Becker","Donna Maryellen Glenn","Elaine Huff","Estella Dixon","Ester Abigail Lancaster","Ethel Cathryn Burgess","Eunice Tonya Flowers","Fanny Meadows","Felecia Norton","Freida Finley","Gwen Tonya Olsen","Hilda Shaffer","Ina Tonya Cervantes","Isabel Mindy Huff","Janice Ayers","Josefa Jenna Barton","Josefa Richards","Lakisha Kristine Doyle","Laurel Levine","Leona Maxine Hampton","Lottie Catalina Hogan","Luella Sims","Mable Thompson","Marlene Jayne Green","Mattie Aimee Goff","Maureen Madeleine Stevens","Rachel Bray","Randi Etta Fulton","Reva Karina Ferguson","Robyn Joseph","Rosetta Marilyn Kennedy","Roxanne Belinda Ewing","Sarah Edna Fitzpatrick","Shana Browning","Sharlene Earlene Guzman","Sheryl Elsa Suarez","Susan Leann Page","Susana Wynn","Tonia Melisa Carney","Vera Karin Reeves","Alfredo Elton Lindsey","Alonzo Bartlett","Antonio Valentin Vaughan","Arron Conrad Sweeney","Art Harmon","Barrett Larson","Bart Velazquez","Bobbie Tate","Cameron Van Sutton","Clayton Phillips","Curt Peters","Devin Larson","Diego Kim","Earl Garrett","Earle Wiggins","Eddy Ray","Edmund Ulysses Haynes","Efrain Sharp","Eliseo Mathew Oneal","Elmer Aron Preston","Enoch Garcia","Errol Dixon","Franklyn Juarez","Harlan Richardson","Hugo Marcelo Estes","Jamal Cruz Merrill","Joseph Walters","Jospeh Louis Spencer","Lawrence Tate","Leonel Roman","Leroy Atkins","Marcel Horn","Max York","Millard Brooks","Odell Kerry Rosa","Ramiro Rivas","Rico Minh Mcdonald","Romeo Velez","Rudolf Harold Leach","Sebastian Hilario Langley","Seth Hyde","Sid Damion Gonzalez","Stephen Reyes Stanley","Thanh Haney","Theodore Soto","Tyree Green","Virgil Gomez","Williams Burgess","Williams Mitch Floyd","Zack Leslie Hicks"];
  var results = $("ul#demo_results");

  demo_data.sort();

  $("form.spotlite").each(function() {
    var $f = $(this);
    $f.spotlite(demo_data, $f.find('.matches'), $f.find('results'));
  });

});

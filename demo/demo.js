$(function() {

  var demo_pool = ['Alex','Bonnie','Colin','Danielle','Earl','Fiona','Gaston','Hermine','Igor','Julia','Karl','Lisa','Matthew','Nicole','Otto','Paula','Richard','Shary','Tomas','Virginie','Walter','Arlene','Bret','Cindy','Don','Emily','Franklin','Gert','Harvey','Irene','Jose','Katia','Lee','Maria','Nate','Ophelia','Philippe','Rina','Sean','Tammy','Vince','Whitney','Alberto','Beryl','Chris','Debby','Ernesto','Florence','Gordon','Helene','Isaac','Joyce','Kirk','Leslie','Michael','Nadine','Oscar','Patty','Rafael','Sandy','Tony','Valerie','William','Andrea','Barry','Chantal','Dorian','Erin','Fernand','Gabrielle','Humberto','Ingrid','Jerry','Karen','Lorenzo','Melissa','Nestor','Olga','Pablo','Rebekah','Sebastien','Tanya','Van','Wendy','Arthur','Bertha','Cristobal','Dolly','Edouard','Fay','Gonzalo','Hanna','Isaias','Josephine','Kyle','Laura','Marco','Nana','Omar','Paulette','Rene','Sally','Teddy','Vicky','Wilfred','Ana','Bill','Claudette','Danny','Erika','Fred','Grace','Henri','Ida','Joaquin','Kate','Larry','Mindy','Nicholas','Odette','Peter','Rose','Sam','Teresa','Victor','Wanda'];
  demo_pool.sort();
  
  var $af = $('dl.autophil');
  
  $('<ul />').addClass('af_pool').appendTo($af.find('dd'));
  
  $.each(demo_pool, function(k, v) {
    $('<li />').text(v).appendTo($af.find('ul.af_pool'));
  });
  
  $af.autophil();

});

$( document ).ready(function() {


var cameras = {
  curiosity:['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM'],
  opportunity:['FHAZ', 'RHAZ', 'PANCAM', 'MINITES', 'NAVCAM'],
  spirit:['FHAZ', 'RHAZ', 'PANCAM', 'MINITES', 'NAVCAM']
};


// Ovde pozivas podatke za rovere
function getRoverData(name, callback){
  
  $.ajax({
    url:'https://api.nasa.gov/mars-photos/api/v1/manifests/'+ name.toLowerCase()+'?api_key=MnVgZ2xIG46leUz6OEccQR3g5iw3vZD1j2PEJKGe',
  method:'GET'
}).done(function(res){
    callback(res);
    showCameras(name);
  });
}

// Ovo je da prikaze koje kamere ima odredjeni rover
function showCameras(name){
  $('#cameras').empty();
  for(var i =0; i < cameras[name].length; i++){
    var span = $('<span>');
    var input = $('<input type="checkbox">');
    input.val(cameras[name][i]);
    span.text(cameras[name][i]);
    input.attr('checked',true);  // Ovo je da budu cekirane kamere od input-a
    $('#cameras').append(input);
    $('#cameras').append(span);
  }
};

// Ovo je da biras koji je rover aktivan
$(".rover").on('click', function() {
	var name = $(this).data('rover');
	$('.rover').removeClass('active');
	$(this).addClass('active');
    getRoverData(name, handleResults);
});

// Ovde dodajes podatke za aktivan rover
function handleResults(res){
  $('#total_photos').text(res.photo_manifest.total_photos);
  $('#max_sol').text(res.photo_manifest.max_sol);

  // max je atribut iz input-a > ovde smo dodali max vrednost sol-selektoru tako sto smo je izjednacili sa maks vrednoscu iz manifest-a
  $("#sol-selector").attr('max', res.photo_manifest.max_sol); 

  $('#landing_date').text(res.photo_manifest.landing_date);
  $('#launch_date').text(res.photo_manifest.launch_date);
  $('#name').text(res.photo_manifest.name);

}
getRoverData('curiosity',handleResults);


// Ovde pozivam slike
function getRoverImages(name, solDan, callback){
  
  $.ajax({
    url:'https://api.nasa.gov/mars-photos/api/v1/rovers/'+ name.toLowerCase() +'/photos?sol='+ solDan +'&api_key=MnVgZ2xIG46leUz6OEccQR3g5iw3vZD1j2PEJKGe',
  method:'GET'
}).done(function(res){
    callback(res);
  });
}


$("#getImages").on('click', function() {
	$('#imageGallery').html('<img class="loading" src="hourglass.svg" />');
	var solDan = $('#sol-selector').val();
	var name = $('.active').data('rover');
	getRoverImages(name, solDan, displayImages);
});

// Ovde menjam broj iznad slider-a
$("#sol-selector").on('change', function() {
	$("#selected_sol").text($(this).val())
})

// Ovde gadjam slike za galeriju
function displayImages(res) {

	// var array = [];
	// if ($('#cameras input:checked').length > 0) {
	//   $('#cameras input:checked').each(function() {
	//     array.push($(this).next().text());
	//   });
	// }
	// for(var i = 0; i < array.length; i++){
	//   if(array[i] = res.photos.name){
	//     console.log(res.photos.name);
	//   }
	// }
	// console.log(array);
	// console.log($('span').text());

	// Ovaj deo vuce slike
	$('#imageGallery').empty();
	  for(var i =0; i < res.photos.length; i++){
	  	// Pravimo li element kojem sam dodao bootstrap klasu da bi namestio popUp lakse
	    var li = $('<li>').addClass("col-md-3");
	    // Pravimo img element dodajemo mu vrednost "i"
	    var image = $('<img src=' + res.photos[i].img_src + '>').addClass( "image-popup" );
	    // Apendujemo <li> u moj <ul> koji ima id="imageGallery"
	    $('#imageGallery').append(li);
	    // Apendujemo <img> u <li> za svaki "i"   (eq je JQ selektor slican kao nth)
	    $('#imageGallery li:eq('+i+')').append(image);
	}
}


	
	// Kad se element doda u DOM da bi se manipulisao ne moze ovako
	// $('.image-popup').on('click',function(){
	// 		$(this).addClass('bigger');
	// });

	// Vec mora ovako posto su se elemeni ucitali nahnadno
	// kada se elementi dodaju u DOM, funkcije kao sto su .click() $(adaksd).on("click") 
	// ne rade zato sto brauzer ucitava JS fajl posle HTML-a i ne zna da su ti elementi dodati u DOM
	$(document).on('click', '.image-popup', function() {
		$(this).toggleClass("bigger");
	});





});
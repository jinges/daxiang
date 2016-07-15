function alert(err){
	$(".alert").remove();
	$('body').append('<div class="alert"><p>'+ err +'</p></div>');
	setTimeout(function(){
		$(".alert").remove();
	}, 2000);
}
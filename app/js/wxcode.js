function getCode(){
	var url = window.location.href;
    var params = url.split('?')[1];
    if(params){
        var code = params.match(/code=(\S*)&/);
        code = code[1]
	    lStorage.set('code', code);
    }
}
var l = window.sessionStorage;

var lStorage = {
	set: function(k, v){
		l.setItem(k,v);
	},
	get: function(k) {
		var v = l.getItem(k);
		if(!v) {
			// window.location.href = '/index.html';
			return false;
		}
		return JSON.parse(v);
	}
}
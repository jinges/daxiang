

function render(dom, templateUrl, data){
	new EJS({url: templateUrl}).update(dom, data)
}
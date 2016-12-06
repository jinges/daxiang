
function updaterebatephone(){
	getMobileCode();
	savePhone('update')
}

function savePhone(type){
	$("#updatephone").click(function(){
		var phone = $("#phone").val();
		var code = $("#valiCode").val();
		var name = $("#name").val();
		if(!name && type == 'add'){
			alert('请输入名称');
			return false;
		}
		
		if(!validatePhone(phone)){
			return false;
		};

		if(!code){
			alert('请输入短信验证码');
			return false;
		}

		getData('valiMobile', {mobileNo: phone, valiCode: code},
			function(err, data){
				if(err) {
					alert(err);
					return false;
				}
				if(type == 'update'){
					postData('updatePhone', JSON.stringify({'phone': phone}),
						function(err){
							if(err) {
								alert(err);
								return false;
							}
							window.location = 'updatephonesuccess.html?phone='+ phone;
						}
					)
				} else {
					postData('addChannel', JSON.stringify({'phone': phone, 'name': name}),
						function(err){
							if(err) {
								alert(err);
								return false;
							}
							window.location = 'registsuccess.html?phone='+ phone;
						}
					)
				}
			}
		);
	});
}
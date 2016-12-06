function withdrawals(){
	var account = 0;
	getChannel(function(data){
		data = data[0];
		account = data.account - data.withdraw;
		$(".account").text(account);
		$(".withdrawa").text(data.withdraw);
		$(".phone").text(data.phone);
	});

	$("#btnWithdrawalview").click(function(){
		if(account < 100){
			alert('低于100元无法提现');
			return false;
		}
		$(".tip").show();
	});
	$("#btnWithdrawal").click(function(){
		
		getData('withdrawals', {}, function(err, data){
			if(err){
				alert(err);
				return false;
			}
			window.location='withdrawalsuccess.html';
		})
	})
}
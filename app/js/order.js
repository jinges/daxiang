var flag = false;
$(function(){
	params = lStorage.get('params');

	$("#sum").keyup(function(){
		var sum = $(this).val();
		var yuan = duihuan(params.buy, sum, params.rate);
		
		$("#yuan").val(yuan+"元人民币")
	}).blur(function(){
		var sum = $(this);
		var result = $("#yuan");
		var yuan = duihuan(params.buy, sum.val(), params.rate);
		if(!yuan) {
			alert('请输入兑换金额');
			return false;
		} else if(yuan * 1 > params.max * 1) {
			result.val(params.max+"元人民币");
			sum.val(Math.floor(params.max/params.rate-params.max%params.rate));
			alert('单笔兑换金额不得高于'+ params.max +'元人民币');
			return false;
		}else if(yuan * 1 < params.min * 1) {
			result.val(params.min+"元人民币");
			sum.val(Math.floor(params.min/params.rate-params.min%params.rate));
			alert('单笔兑换金额不得低于'+ params.min +'元人民币');
			return false;
		}
		if(params.buy == 'CNY') {
			var mo = sum.val()%currencyObj[params.sell][1];
			if(mo) {
				sum.val(sum.val());
				yuan = duihuan(params.buy, sum.val(), params.rate);
				result.val(yuan+"元人民币")
				alert('需输入最小兑换面额'+currencyObj[params.sell][1]+'的整数倍');
				return false;
			}
		} else {
			var mo = sum.val()%currencyObj[params.buy][1]
			if(mo) {
				sum.val(sum.val());
				yuan = duihuan(params.buy, sum.val(), params.rate);
				result.val(yuan+"元人民币")
				alert('需输入最小兑换面额'+currencyObj[params.buy][1]+'的整数倍');
				return false;
			}
		}

		params.money = yuan;
	})



	$("#btn_orderView").click(function(){
		params.sum = $('#sum').val();
		params.changer = $("#changer").val();
		params.idType = $("#IDType").val();
		params.idTypeText = $('#IDType option').not(function(){ return !this.selected }).text();
		params.idNo = $("#ID").val();
		params.reference = $("#reference").val();
		params.mobileNo = $("#phone").val();

		if(!params.sum) {
			alert('请输入兑换金额');
			return false;
		} else if(params.money * 1 > params.max * 1) {
			alert('单笔兑换金额不得高于'+ params.max +'元人民币');
			return false;
		}else if(params.money * 1 < params.min * 1) {
			alert('单笔兑换金额不得低于'+ params.min +'元人民币');
			return false;
		}

		if(!params.changer) {
			alert('请输入兑换人姓名');
			return false;
		}

		if(params.idType == 1) {
			if(!/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(params.idNo)){
				alert('身份证信息不正确');
				return false;
			}
		} else {
			if(!params.idNo) {
				alert('请输入护照信息');
				return false;
			}
		}

		if(!params.mobileNo) {
			alert('请输入手机号码');
			return false;
		} else if (!/1\d{10}/.test(params.mobileNo)) {
			alert('请输入正确的手机号码');
			return false;
		}

		if(params.reference) {
			if(!/(1\d{10})|(^[a-zA-Z]\d{3}[a-zA-Z])$/.test(params.reference)) {
				alert('推荐人信息有误');
			}
		}

		

		getData('isExistMobile', {mobileNo: params.mobileNo},
			function(err, data){
				if(err) {
					alert(err);
					return false;
				}
				params.hasPhone = data.isExist == '0';
				if(params.buy == 'CNY') {
					params.type = '外币兑换人民币';
					params.currency = currencyObj[params.sell][0];
				} else {
					params.type = '人民币兑换外币';
					params.currency = currencyObj[params.buy][0];
				}
				if(params.IDType == 1) {
					params.IDTypeText = ''
				}
			    lStorage.set('params', JSON.stringify(params));
				window.location.href = 'view.html';
			}
		);
		
	});

	

})

var status =  ["待审核", "已受理", "拒绝", "取消", "完成"];
var orderList = [];

function initOrderPage(){
	if(params.buy == 'CNY') {
		$("#buy").text("卖出"+currencyObj[params.sell][0]);
		$("#sell").text('预计所得');
		$("#sum").attr('placeholder', '最小兑换面额'+currencyObj[params.sell][1]+'的整数倍 '+params.sell)
	} else {
		$("#buy").text("买入"+currencyObj[params.buy][0]);
		$("#sell").text('预计所需');
		$("#sum").attr('placeholder', '最小兑换面额'+currencyObj[params.buy][1]+'的整数倍 '+params.buy)
	}

}

function getMyOrder(){
	getCode();
	getOrderData();

	$("#search").submit(function(){
		var search = $(this).find('.text').val();
		if(!search) {
			return false;
		}
		getOrderData({'key': search});
		return false;
	})
}

function getOrderData(params){
	getData('myOrder', params, function(err, data){
		if(err){
			alert(err);
			return false;
		}
		orderList = data.list;
		for(var i=0,len=orderList.length; i<len; i++) {
			var item = orderList[i];
			if(item.buy == 'CNY') {
				item.type = '外币兑换人民币';
				item.currency = currencyObj[item.sell][0];
			} else {
				item.type = '人民币兑换外币';
				item.currency = currencyObj[item.buy][0];
			}
			item.orderStatusText = getStatus(item.orderStatus);
		}
		render("myorder", 'template/orderlist.ejs', data);
		
		$('#myorder li').on('click', function(){
			var index = $(this).attr('data-index');
			var order = orderList[index];
		    lStorage.set('params', JSON.stringify(order));
		    window.location.href = 'view.html'
		})
	});
}

function getStatus(code){
	var status = '';
	switch(code) {
		case 1: 
			status = '<span  class="waite">待审核</span>';
			break;
		case 2: 
			status = '<span  class="done">已受理</span>';
			break;
		case 3:
			status = '<span  class="refuse">拒绝</span>';
			break;
		case  4:
			status = '<span  class="cancel">取消</span>';
			break;
		case 5:
			status = '<span  class="finish">完成</span>';
			break;
	}
	return status;
}

function viewOrder(){
	var params = lStorage.get('params');
	if (params.idType == 1) {
		params.idTypeText = '身份证';
	} else {
		params.idTypeText = '护照';
	}

	if(params.buy == 'CNY') {
		params.buy ="卖出:"+params.sum+currencyObj[params.sell][0];
		params.sell = '预计所得:';
	} else {
		params.buy="买入:"+params.sum+currencyObj[params.buy][0];
		params.sell='预计所需:';
	}


	params.yuan = duihuan(params.buy, params.sum, params.rate);

	render("view", 'template/view.ejs', params);
	viewEvent()
}


function viewEvent(){
	$("#getCode").live('click', function(){
		var that = $(this);
		if(flag){
			return false;
		}
		var s = 120;
		var  cutDown = setInterval(function(){
			if(s==0) {
				clearInterval(cutDown);
				that.text('获取验证码');
				flag = false;
				return false;
			}
			that.text(--s+"s");
		}, 1000);
		flag = true;
		getData('sendCode', {mobileNo: params.mobileNo}, 
			function(err){
				if(err) {
					alert(err);
					return false;
				}
				alert('验证码已发送');
			}
		);
	});
	$("#btn-order").on('click', function(){
		var valiCode  = $("#valiCode").val();

		if(params.hasPhone && !valiCode) {
			alert('请输入验证码');
			return false;
		}
		if(!$("#agree").prop("checked")) {
			alert('请同意《大象汇率服务条款》');
			return false
		}
		if(params.hasPhone) {
			getData('valiMobile', {mobileNo: params.mobileNo, valiCode: valiCode},
				function(err, data){
					if(err) {
						alert(err);
						return false;
					}
					saveOrer();
				}
			);
		} else {
			saveOrer();
		}
	})

	function saveOrer(){
		postData('order', JSON.stringify(params), function(err, data){
					if(err) {
						alert(err);
						return false;
					}

					window.location.href="success.html";
				})
	}
	$('.back').on('click', function(){
		window.history.go(-1);
	})

	$('.cancel').on('click', function(){
		if(confirm('进确定要取消订单？')) {
			var id = params.id;

			getData('cancelOrder',{orderId: id}, function(err){
				if(err) {
					alert(err);
					return false;
				}
				alert('订单已取消');
				window.location.href = 'myorder.html';
			})
		}
	})
}

function duihuan(type, sum, rate){
	var yuan = 0;
	if(type == 'CNY') {
		yuan = (sum / rate).toFixed(2);
	} else {
		yuan = (sum * rate).toFixed(2);
	}
	return yuan;
}
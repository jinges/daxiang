var params = {};
var storeList = [];

function search(){
	getCode();
	getData('dates', null, function(err, data){
		if(err){
			alert(err);
			return false;
		}
    	var options = '';
    	data = data.list;
    	for(var i = 0,len = data.length; i< len; i++) {
    		var item = data[i];
    		options+= '<option value="'+ item +'">'+ item +'</option>'
    	}
    	$("#takeDate").append(options);
    })

	getData('cities', null, function(err, data){
		if(err){
			alert(err);
			return false;
		}
    	var options = '';
    	data = data.list;
    	for(var i = 0,len = data.length; i< len; i++) {
    		var item = data[i];
    		options+= '<option value="'+ item.id +'">'+ item.name +'</option>'
    	}
    	$("#cities").append(options);
    })

    getData('areas', null, function(err, data){
		if(err){
			alert(err);
			return false;
		}
    	var options = '';
    	data = data.list;
    	for(var i = 0,len=data.length; i< len; i++) {
    		var item = data[i];
    		options+= '<option value="'+ item.id +'">'+ item.name +'</option>'
    	}
    	$("#areas").append(options);
    })

    $('#btn_search').on('click', function(){
		params = {
			buy: $('#buy').val(),
			sell: $("#sell").val(),
			takeDate: $('#takeDate').val(),
			cityId: $('#cities').val(),
			areaId: $('#areas').val()
		}

		if(params.buy == 0) {
			alert('请选择兑换类型');
			return false;
		}
		if(params.sell == 0) {
			alert('请选择外币币种');
			return false;
		}
		if(params.takeDate == 0) {
			alert('请选择取钞日期');
			return false;
		}
		if(params.cityId == 0) {
			alert('请选择网点城市');
			return false;
		}
		if(params.areaId ==0) {
			alert('请选择网点位置');
			return false;
		}
		if(params.buy==1) {
			params.buy = 'CNY';
		} else if (params.buy ==2) {
			params.buy = params.sell;
			params.sell = 'CNY';
		}

	    lStorage.set('params', JSON.stringify(params));
		window.location.href = 'store.html';
	})
}

function store(){
	params = lStorage.get('params');
	getData('storeList', params, function(err, data){
		if(err) {
			alert(err);
			return false;
		}
		storeList = data.list;
		for(var i=0,len=storeList.length; i< len; i++) {
			var item = storeList[i];
			if(params.buy == 'CNY') {
					item.rateText = '100'+currencyObj[params.sell][0]+'='+item.rate * 100+'人民币'; 
				} else {
					item.rateText = '100'+currencyObj[params.buy][0]+'='+item.rate * 100+'人民币';
				}
		}
        render("store_list", 'template/store.ejs', data);
        if(!storeList.length) {
        	$(".btn-view .cell").eq(1).hide();
        	return false;
        } else {
        	$(".btn-view .cell").eq(0).hide();
        }
        storeEvent();
	});
}

function storeEvent(){
	$('#btn_store').on('click', function(){
		if(!params.index) {
			alert('请选择网点。');
			return false;
		}
		var data = storeList[params.index];
		for(k in data) {
			params[k] = data[k];
		}
		params.storeId = params.id; //网点id;
		params.id = '';
		// delete params.id;
		lStorage.set('params', JSON.stringify(params));
		window.location.href = 'order.html';
	})

	$('#store_list .more').on('click', function(e){
		var that = $(this);
		if(that.hasClass('top')){
			that.removeClass('top').prev().hide().prev().hide();
		} else {
			that.addClass('top').prev().show().prev().show();
		}
		e.stopPropagation();
	})

	$("#store_list li").on('click',function(e){
		var that = $(this);
		params.index = that.attr('data-index');
		if(that.siblings()){
			that.addClass('selected').siblings().removeClass('selected');
		}
		e.stopPropagation()
	})
}


var currencyObj = {
	USD: ['美元', 50], 
	JPY: ['日元', 10000],
    AUD: ['澳大利亚元', 50],
    EUR: ['欧元', 500],
    HKD: ['港币', 500],
    AED: ['阿联酋迪拉姆', 500],
    DKK: ['丹麦克朗', 1000],
    CHF: ['瑞士法郎', 1000],
    CAD: ['加拿大元', 50],
    BRL: ['巴西里亚尔', ],
    GBP: ['英镑', 20],
    INR: ['印度卢比', 1000],
    IDR: ['印尼卢比', 100000],
    TWD: ['新台币', 1000],
    THB: ['泰国铢', 1000],
    SGD: ['新加坡元', 1000],
    SEK: ['瑞典克朗', 1000],
    PHP: ['菲律宾比索', 1000],
    NZD: ['新西兰元', 100]
}


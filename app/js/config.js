
var HOST =  '';//'http://wx.fxswap.cn';//
var code = lStorage? lStorage.get('code'): code;

var api = {
	dates:  HOST+'/wx/getOrderDate.do?code='+code, 
	cities: HOST+'/common/getUsefullCities.do?code='+code,
	areas: HOST+'/common/getAreas.do?code='+code,
	storeList: HOST+'/wx/getStoreList.do?code='+code,
	sendCode: HOST+'/wx/sendValiCode.do?code='+code,
	valiMobile: HOST+'/wx/valiMobile.do?code='+code,
	isExistMobile: HOST+'/wx/isExistMobile.do?code='+code,
    order: HOST+'/wx/editOrder.do?code='+code,
    myOrder: HOST+'/wx/getMyOrderList.do?code='+code,
    cancelOrder: HOST+'/wx/cancelOrder.do?code='+code
}

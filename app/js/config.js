
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
    viewOrder: HOST+'/wx/getMyOrderById.do?code='+code,
    cancelOrder: HOST+'/wx/cancelOrder.do?code='+code,

    channel: HOST+'/wx/getChannelInfo.do?code='+code,
    updatePhone: HOST+'/wx/updatePhone.do?code='+code,
    addChannel: HOST+'/wx/addChannel.do?code='+code,
    withdrawals: HOST+'/wx/withdraw.do?code='+code
}

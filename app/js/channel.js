
function channel(){
	getCode();
	getChannel(function(data){
        if(!data.length){
            window.location = 'registchannel.html';
            return false;
        }

        $(".index").show();
        data = data[0];
        $(".qr").prop('src', 'data:image/png;base64,'+data.qrimage);
        $("#phone").text(data.phone);
    });

    $("#givefriend").click(function(){
        $(".bigqr").show();
    });
}

function getChannel(cb){
    getData('channel', params, function(err, data){
        if(err){
            alert(err);
            return false;
        }
        data = data.list;
        cb(data);
        
    })
}
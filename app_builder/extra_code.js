//enables jquery request from node console-------------------------------------
var XMLHttpRequest = require('./xhr').XMLHttpRequest;
global.ajax = function (request_type,url,data,content_type,cookie, complete) {
    if (content_type==null){
        content_type ="application/x-www-form-urlencoded; charset=UTF-8";
    }
    console.log("global.ajax")
    console.log(cookie)
    console.log("global.ajax")

    data = $.param(data)
    var xhr = new XMLHttpRequest();
    xhr.debug = true;
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 2) {
            console.log("---------------------------------------------------------------------------")
            console.log(xhr.getResponseHeader("Set-Cookie"))
            console.log(xhr.getResponseHeader("Content-Type"))
            console.log(xhr.getResponseHeader("Access-Control-Allow-Origin"))
            console.log("---------------------------------------------------------------------------")

        }

        if (xhr.readyState === 4) {

            complete(xhr);
        }
    };
    xhr.open(request_type, url, true);
    xhr.setRequestHeader("Content-Type", content_type);
    var cook = "__cfduid=d063f503f45cd7636266d74d3d2d7150e1464912465; __utma=267422216.386322813.1464912900.1465016666.1465020284.8; __utmc=267422216; __utmz=267422216.1464912900.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); uiSettings=%7B%7D; _ga=GA1.2.386322813.1464912900; .ASPXAUTH2=AHW5fDvetqxT1TIz3R9EO+iE94H1p8Qphi9bCW/Ey3qogSTojg/9xLc9G73MvqMgv2OZqHNlfun1PkmzwHNrixXVZ6dwI+wlH8nbBVhynAT186Yh44a14G8etlBU9grEOhensQRp8gJU+Xlxeyk0mvA="
    //xhr.setRequestHeader("Origin", "chrome-extension://hjlpkbcaebmklnbdopedglaiafedenff");
    xhr.setRequestHeader("Cookie", cook);
    //console.log("__cfduid=d063f503f45cd7636266d74d3d2d7150e1464912465; __utma=267422216.386322813.1464912900.1465016666.1465020284.8; __utmc=267422216; __utmz=267422216.1464912900.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); uiSettings=%7B%7D; _ga=GA1.2.386322813.1464912900; .ASPXAUTH2=AHW5fDvetqxT1TIz3R9EO+iE94H1p8Qphi9bCW/Ey3qogSTojg/9xLc9G73MvqMgv2OZqHNlfun1PkmzwHNrixXVZ6dwI+wlH8nbBVhynAT186Yh44a14G8etlBU9grEOhensQRp8gJU+Xlxeyk0mvA=")
    //xhr.setRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36");


    xhr.send(data);
};
var dataToSend = { EmailAddress: "notun.id.rocky@gmail.com", Password: 'kothin007' }
var content_type="application/x-www-form-urlencoded; charset=UTF-8"
var cookie = null
var request_type = "POST"
var url = "https://api.weekplan.net/v2/sessions"
ajax(request_type,url,dataToSend,content_type,cookie,function (xhr) {
    global.cookie = xhr.getResponseHeader("Set-Cookie")
    console.log(xhr.responseText)

    /*    var content_type="application/x-www-form-urlencoded; charset=UTF-8"
     var cookie = xhr.getResponseHeader("Set-Cookie")
     console.log(cookie)
     var request_type = "GET"
     var url = "https://api.weekplan.net/v2/workspaces"
     ajax(request_type,url,dataToSend,content_type,cookie,function (xhr) {
     console.log('new request-----------------------------------------')
     console.log(xhr.responseText)
     console.log('new request-----------------------------------------')


     })*/
    $.support.cors = true;
    $.ajaxSettings.xhr = function() {
        try {return new XMLHttpRequest();
        } catch ( e ) {}
        console.log(e)
    };
});
//enables jquery request from node console-------------------------------------